import axios from "axios";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const {
  REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET,
  REDDIT_REFRESH_TOKEN,
  REDDIT_USER_AGENT,
  GROQ_API_KEY,
} = process.env;

if (
  !REDDIT_CLIENT_ID ||
  !REDDIT_CLIENT_SECRET ||
  !REDDIT_REFRESH_TOKEN ||
  !REDDIT_USER_AGENT ||
  !GROQ_API_KEY
) {
  throw new Error("Missing required environment variables");
}

async function getRedditAccessToken() {
  const auth = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString("base64");
  try {
    const response = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      `grant_type=refresh_token&refresh_token=${REDDIT_REFRESH_TOKEN}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": REDDIT_USER_AGENT,
        },
      }
    );
    return response.data.access_token;
  } catch (err) {
    console.error("Failed to get Reddit access token:", err?.response?.data || err.message);
    throw err;
  }
}

async function fetchRedditUserData(username, accessToken, limit = 10) {
  const cleanUsername = username.replace(/^u\//i, "").trim();

  // Fetch user posts
  const postsRes = await axios.get(
    `https://oauth.reddit.com/user/${cleanUsername}/submitted?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": REDDIT_USER_AGENT,
      },
    }
  );

  // Fetch user comments
  const commentsRes = await axios.get(
    `https://oauth.reddit.com/user/${cleanUsername}/comments?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": REDDIT_USER_AGENT,
      },
    }
  );

  const posts = postsRes.data.data.children.map((p) => ({
    title: p.data.title,
    content: p.data.selftext || "",
    subreddit: p.data.subreddit,
    score: p.data.score,
  }));

  const comments = commentsRes.data.data.children.map((c) => ({
    content: c.data.body,
    subreddit: c.data.subreddit,
    score: c.data.score,
  }));

  return {
    username: cleanUsername,
    totalPosts: posts.length,
    totalComments: comments.length,
    posts,
    comments,
  };
}

function buildGroqPrompt(redditData) {
  return `
You are a personality analyst.

Analyze the following Reddit user's posts and comments to construct a psychological persona. Focus on interests, lifestyle, communication style, values, political orientation, and personality traits.

Reddit Username: ${redditData.username}
Total Posts: ${redditData.totalPosts}
Total Comments: ${redditData.totalComments}

Recent Posts:
${JSON.stringify(redditData.posts, null, 2)}

Recent Comments:
${JSON.stringify(redditData.comments, null, 2)}

Respond with a JSON in this format:
{
  "name": "string",
  "age": "string",
  "location": "string",
  "occupation": "string",
  "interests": ["string"],
  "personality": ["string"],
  "political_view": "string",
  "lifestyle": "string",
  "communication_style": "string",
  "values": ["string"],
  "archetype": "string",
  "narrative": "string"
}
`;
}

async function generateGroqPersona(prompt) {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3-70b-8192",
        messages: [
          { role: "system", content: "You are an expert psychologist." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    try {
      return JSON.parse(content);
    } catch {
      return { raw: content };
    }
  } catch (err) {
    console.error("Groq API call failed:", err?.response?.data || err.message);
    throw err;
  }
}

app.post("/api/analyze", async (req, res) => {
  const { username, demo } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  // Demo mode: return hardcoded data
  if (demo) {
    const demoRedditData = {
      username: "DemoUser",
      totalPosts: 2,
      totalComments: 2,
      posts: [
        { title: "My favorite programming language", content: "I love Python!", subreddit: "learnprogramming", score: 42 },
        { title: "Show HN: My new project", content: "Check out my new web app!", subreddit: "webdev", score: 30 }
      ],
      comments: [
        { content: "Great post! Thanks for sharing.", subreddit: "learnprogramming", score: 10 },
        { content: "I prefer JavaScript for frontend work.", subreddit: "webdev", score: 8 }
      ]
    };
    const demoPersona = {
      name: "Alex Demo",
      age: "25-30",
      location: "San Francisco, CA",
      occupation: "Software Engineer",
      interests: ["Programming", "Startups", "AI"],
      personality: ["Curious", "Analytical", "Friendly"],
      political_view: "Liberal",
      lifestyle: "Active, Tech-focused",
      communication_style: "Direct, Supportive",
      values: ["Learning", "Innovation", "Community"],
      archetype: "The Builder",
      narrative: "I'm Alex, a passionate developer who loves building things and helping others learn."
    };
    return res.json({
      success: true,
      data: {
        redditData: demoRedditData,
        persona: demoPersona,
      },
    });
  }

  try {
    const token = await getRedditAccessToken();
    const redditData = await fetchRedditUserData(username, token);
    const prompt = buildGroqPrompt(redditData);
    const persona = await generateGroqPersona(prompt);

    res.json({
      success: true,
      data: {
        redditData,
        persona,
      },
    });
  } catch (error) {
    console.error("Error in /api/analyze:", error?.response?.data || error.message);
    res.status(500).json({ success: false, error: error?.message || "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 