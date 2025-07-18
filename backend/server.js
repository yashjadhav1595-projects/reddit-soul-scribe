import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the parent directory (main project directory)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const {
  REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET,
  REDDIT_USER_AGENT,
  REDDIT_USERNAME,
  REDDIT_PASSWORD,
  REDDIT_REFRESH_TOKEN,
  PERPLEXITY_API_KEY,
  NODE_ENV = 'development'
} = process.env;

// Debug: Log environment variables (without sensitive data)
console.log('🔍 Environment variables loaded:');
console.log('   REDDIT_CLIENT_ID:', REDDIT_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('   REDDIT_CLIENT_SECRET:', REDDIT_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('   REDDIT_USER_AGENT:', REDDIT_USER_AGENT ? '✅ Set' : '❌ Missing');
console.log('   REDDIT_USERNAME:', REDDIT_USERNAME ? '✅ Set' : '❌ Missing');
console.log('   REDDIT_PASSWORD:', REDDIT_PASSWORD ? '✅ Set' : '❌ Missing');
console.log('   REDDIT_REFRESH_TOKEN:', REDDIT_REFRESH_TOKEN ? '✅ Set' : '❌ Missing');
console.log('   PERPLEXITY_API_KEY:', PERPLEXITY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('   NODE_ENV:', NODE_ENV);
console.log('   PORT:', process.env.PORT || 3001);

const missingVars = [];
if (!REDDIT_CLIENT_ID) missingVars.push('REDDIT_CLIENT_ID');
if (!REDDIT_CLIENT_SECRET) missingVars.push('REDDIT_CLIENT_SECRET');
if (!REDDIT_USER_AGENT) missingVars.push('REDDIT_USER_AGENT');
if (!REDDIT_USERNAME) missingVars.push('REDDIT_USERNAME');
if (!REDDIT_PASSWORD) missingVars.push('REDDIT_PASSWORD');
if (!PERPLEXITY_API_KEY) missingVars.push('PERPLEXITY_API_KEY');

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../dist')));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", // Uppercase for frontend compatibility
    message: "Backend is running",
    timestamp: new Date().toISOString(),
    mode: NODE_ENV,
    hasRedditConfig: !!(REDDIT_CLIENT_ID && REDDIT_CLIENT_SECRET && REDDIT_USER_AGENT && REDDIT_USERNAME && REDDIT_PASSWORD),
    hasPerplexityConfig: !!PERPLEXITY_API_KEY
  });
});

// --- REDDIT OAUTH2: SUPPORT BOTH REFRESH TOKEN AND PASSWORD GRANT ---
// Replace getRedditAccessToken with password grant only, matching Reddit quick start
async function getRedditAccessToken() {
  const auth = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString("base64");
  const data = `grant_type=password&username=${encodeURIComponent(REDDIT_USERNAME)}&password=${encodeURIComponent(REDDIT_PASSWORD)}`;
  const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": REDDIT_USER_AGENT,
  };
  console.log('[DEBUG] About to request Reddit access token with:');
  console.log('  URL:', "https://www.reddit.com/api/v1/access_token");
  console.log('  Data:', data);
  console.log('  Headers:', headers);
  try {
    console.log('[Reddit] Fetching access token using password grant (Reddit quick start mode)...');
    const response = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      data,
      { headers }
    );
    console.log('[Reddit] Access token obtained.');
    return response.data.access_token;
  } catch (err) {
    console.error("Failed to get Reddit access token (password grant):", err?.response?.data || err.message);
    console.error("Full error object:", err);
    if (err?.response) {
      throw {
        message: 'Failed to get Reddit access token (password grant)',
        reddit: err.response.data,
        status: err.response.status,
        stack: err.stack
      };
    }
    throw err;
  }
}

// --- Use this function to fetch Reddit user data with a real access token ---
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

// New comprehensive user data fetching function
async function fetchComprehensiveUserData(username, accessToken, limit = 25) {
  const cleanUsername = username.replace(/^u\//i, "").trim();
  
  try {
    console.log(`[Reddit] Fetching user profile for ${cleanUsername}...`);
    // Fetch basic user information
    const userInfoRes = await axios.get(
      `https://oauth.reddit.com/user/${cleanUsername}/about`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": REDDIT_USER_AGENT,
        },
      }
    );

    const userInfo = userInfoRes.data.data;
    console.log(`[Reddit] User profile fetched.`);

    console.log(`[Reddit] Fetching user's submitted posts...`);
    // Fetch user's submitted posts
    const submittedRes = await axios.get(
      `https://oauth.reddit.com/user/${cleanUsername}/submitted?limit=${limit}&sort=top&t=year`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": REDDIT_USER_AGENT,
        },
      }
    );
    console.log(`[Reddit] User's posts fetched.`);

    console.log(`[Reddit] Fetching user's comments...`);
    // Fetch user's comments
    const commentsRes = await axios.get(
      `https://oauth.reddit.com/user/${cleanUsername}/comments?limit=${limit}&sort=top&t=year`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": REDDIT_USER_AGENT,
        },
      }
    );
    console.log(`[Reddit] User's comments fetched.`);

    console.log(`[Reddit] Fetching user's overview (recent activity)...`);
    // Fetch user's overview (recent activity)
    const overviewRes = await axios.get(
      `https://oauth.reddit.com/user/${cleanUsername}/overview?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": REDDIT_USER_AGENT,
        },
      }
    );
    console.log(`[Reddit] User's overview fetched.`);

    // Process submitted posts
    const submitted = submittedRes.data.data.children.map((post) => ({
      id: post.data.id,
      title: post.data.title,
      content: post.data.selftext || "",
      subreddit: post.data.subreddit,
      score: post.data.score,
      upvote_ratio: post.data.upvote_ratio,
      num_comments: post.data.num_comments,
      created_utc: post.data.created_utc,
      url: post.data.url,
      is_self: post.data.is_self,
      domain: post.data.domain,
      over_18: post.data.over_18,
      spoiler: post.data.spoiler,
      stickied: post.data.stickied,
      locked: post.data.locked,
      archived: post.data.archived,
      gilded: post.data.gilded,
      author: post.data.author,
      permalink: post.data.permalink,
    }));

    // Process comments
    const comments = commentsRes.data.data.children.map((comment) => ({
      id: comment.data.id,
      content: comment.data.body,
      subreddit: comment.data.subreddit,
      score: comment.data.score,
      created_utc: comment.data.created_utc,
      parent_id: comment.data.parent_id,
      link_id: comment.data.link_id,
      gilded: comment.data.gilded,
      author: comment.data.author,
      permalink: comment.data.permalink,
      is_submitter: comment.data.is_submitter,
      distinguished: comment.data.distinguished,
    }));

    // Process overview (mixed content)
    const overview = overviewRes.data.data.children.map((item) => ({
      id: item.data.id,
      type: item.data.kind === 't3' ? 'post' : 'comment',
      title: item.data.title || item.data.body?.substring(0, 100) + '...',
      content: item.data.selftext || item.data.body || "",
      subreddit: item.data.subreddit,
      score: item.data.score,
      created_utc: item.data.created_utc,
      author: item.data.author,
      permalink: item.data.permalink,
    }));

    // Analyze user activity patterns
    const activityAnalysis = analyzeUserActivity(submitted, comments, userInfo);

    return {
      username: cleanUsername,
      userInfo: {
        name: userInfo.name,
        created_utc: userInfo.created_utc,
        link_karma: userInfo.link_karma,
        comment_karma: userInfo.comment_karma,
        total_karma: userInfo.total_karma,
        is_gold: userInfo.is_gold,
        is_mod: userInfo.is_mod,
        has_verified_email: userInfo.has_verified_email,
        created: new Date(userInfo.created_utc * 1000).toISOString(),
        account_age_days: Math.floor((Date.now() / 1000 - userInfo.created_utc) / 86400),
      },
      submitted: {
        total: submitted.length,
        posts: submitted,
        top_subreddits: getTopSubreddits(submitted),
        average_score: calculateAverageScore(submitted),
        total_karma: submitted.reduce((sum, post) => sum + post.score, 0),
      },
      comments: {
        total: comments.length,
        comments: comments,
        top_subreddits: getTopSubreddits(comments),
        average_score: calculateAverageScore(comments),
        total_karma: comments.reduce((sum, comment) => sum + comment.score, 0),
      },
      overview: {
        total: overview.length,
        items: overview,
        recent_activity: overview.slice(0, 10),
      },
      activityAnalysis,
      summary: {
        total_posts: submitted.length,
        total_comments: comments.length,
        total_karma: userInfo.total_karma,
        account_age_days: Math.floor((Date.now() / 1000 - userInfo.created_utc) / 86400),
        karma_per_day: userInfo.total_karma / Math.max(1, Math.floor((Date.now() / 1000 - userInfo.created_utc) / 86400)),
        most_active_subreddits: getTopSubreddits([...submitted, ...comments]).slice(0, 5),
      }
    };
  } catch (error) {
    console.error(`[Reddit] Error fetching data for user ${cleanUsername}:`, error?.response?.data || error.message);
    console.error("Full error object:", error);
    throw error;
  }
}

// Helper function to get top subreddits
function getTopSubreddits(items) {
  const subredditCount = {};
  items.forEach(item => {
    const subreddit = item.subreddit;
    subredditCount[subreddit] = (subredditCount[subreddit] || 0) + 1;
  });
  
  return Object.entries(subredditCount)
    .map(([subreddit, count]) => ({ subreddit, count }))
    .sort((a, b) => b.count - a.count);
}

// Helper function to calculate average score
function calculateAverageScore(items) {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + item.score, 0);
  return Math.round(total / items.length);
}

// Helper function to analyze user activity patterns
function analyzeUserActivity(submitted, comments, userInfo) {
  const now = Date.now() / 1000;
  const accountAge = now - userInfo.created_utc;
  
  // Analyze posting frequency
  const recentPosts = submitted.filter(post => now - post.created_utc < 30 * 24 * 60 * 60); // Last 30 days
  const recentComments = comments.filter(comment => now - comment.created_utc < 30 * 24 * 60 * 60);
  
  // Calculate activity patterns
  const postsPerDay = submitted.length / Math.max(1, accountAge / 86400);
  const commentsPerDay = comments.length / Math.max(1, accountAge / 86400);
  const recentActivity = (recentPosts.length + recentComments.length) / 30; // Activity per day in last 30 days
  
  // Analyze content types
  const selfPosts = submitted.filter(post => post.is_self);
  const linkPosts = submitted.filter(post => !post.is_self);
  
  // Analyze engagement
  const avgPostScore = calculateAverageScore(submitted);
  const avgCommentScore = calculateAverageScore(comments);
  const totalEngagement = submitted.reduce((sum, post) => sum + post.num_comments, 0);
  
  return {
    activityLevel: {
      postsPerDay: Math.round(postsPerDay * 100) / 100,
      commentsPerDay: Math.round(commentsPerDay * 100) / 100,
      recentActivity: Math.round(recentActivity * 100) / 100,
      totalActivity: submitted.length + comments.length,
    },
    contentAnalysis: {
      selfPosts: selfPosts.length,
      linkPosts: linkPosts.length,
      selfPostRatio: submitted.length > 0 ? (selfPosts.length / submitted.length) : 0,
      avgPostScore,
      avgCommentScore,
      totalEngagement,
    },
    engagement: {
      avgPostScore,
      avgCommentScore,
      totalEngagement,
      engagementPerPost: submitted.length > 0 ? totalEngagement / submitted.length : 0,
    },
    patterns: {
      isActive: recentActivity > 0.1, // More than 0.1 activities per day
      isEngaged: avgPostScore > 10 || avgCommentScore > 5,
      isContentCreator: submitted.length > comments.length * 0.5,
      isCommenter: comments.length > submitted.length * 2,
    }
  };
}

// Perplexity persona generation
async function generatePerplexityPersona(userData) {
  const modelName = 'sonar'; // Use a valid Perplexity model
  console.log(`[Perplexity] Entered generatePerplexityPersona. Using model: ${modelName}`);
  const prompt = `Given the following Reddit user data, generate a user persona in this JSON format:\n\n{
  "name": "string",
  "age": "string",
  "occupation": "string",
  "status": "string",
  "location": "string",
  "tier": "string",
  "archetype": "string",
  "traits": ["string"],
  "motivations": { "convenience": 1-5, "wellness": 1-5, "speed": 1-5, "preferences": 1-5, "comfort": 1-5, "dietary_needs": 1-5 },
  "personality": { "introvert": 1-5, "extrovert": 1-5, "intuition": 1-5, "sensing": 1-5, "feeling": 1-5, "thinking": 1-5, "perceiving": 1-5, "judging": 1-5 },
  "behaviour": ["string"],
  "frustrations": ["string"],
  "goals": ["string"],
  "quote": "string",
  "simulated_post": "string" // Add a simulated Reddit post this user might write, based on their persona and writing style.",
  "citations": {
    "name": { "text": "post or comment text", "link": "permalink" },
    "age": { "text": "...", "link": "..." },
    "occupation": { "text": "...", "link": "..." },
    ...
    // For each persona field above, cite the post or comment (with text and permalink) that was used to infer it.
    // If a field is inferred from multiple posts/comments, cite the most relevant one.
    // If a field is not directly supported by any post/comment, leave its citation empty.
  }
}\n\nUser data:\n${JSON.stringify(userData)}\n\nReturn only the JSON object.`;
  try {
    const payload = {
      model: modelName,
      messages: [
        { role: 'system', content: 'You are a world-class user persona analyst.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1400,
      temperature: 0.7
    };
    console.log('[Perplexity] About to send API request with payload:');
    console.log(JSON.stringify(payload, null, 2));
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000 // 30 seconds
      }
    );
    console.log('[Perplexity] Raw API response:');
    console.log(JSON.stringify(response.data, null, 2));
    let content = response.data.choices?.[0]?.message?.content || response.data.choices?.[0]?.text || '';
    let persona;
    try {
      persona = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) persona = JSON.parse(match[0]);
      else {
        console.error('[Perplexity] Could not parse persona JSON from response. Raw content:', content);
        throw new Error('Could not parse persona JSON from Perplexity response.');
      }
    }
    console.log('[Perplexity] Persona JSON parsed successfully.');
    return persona;
  } catch (err) {
    console.error(`[Perplexity] API call failed for model ${modelName}:`, err?.response?.data || err.message);
    if (err?.response) {
      console.error('[Perplexity] Full error response:', JSON.stringify(err.response.data, null, 2));
    }
    console.error(`[Perplexity] If this model fails, try switching to another available model in the code.`);
    throw err;
  }
}

app.post("/api/analyze", async (req, res) => {
  console.log("[Express] /api/analyze endpoint hit.");
  const { username, comprehensive = false, exportPath } = req.body;
  console.log(`[Express] Request body: username=${username}, comprehensive=${comprehensive}, exportPath=${exportPath}`);
  if (!username) {
    console.log("[Express] Missing username in request body.");
    return res.status(400).json({ error: "Missing username", alert: "Please provide a Reddit username." });
  }
  if (!exportPath || typeof exportPath !== 'string' || !exportPath.trim()) {
    return res.status(400).json({
      success: false,
      error: "Missing exportPath",
      alert: "Please select a location to save the exported files."
    });
  }
  // Check if required environment variables are set
  if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET || !REDDIT_USER_AGENT || !PERPLEXITY_API_KEY) {
    console.log("[Express] Missing required environment variables.");
    return res.status(500).json({ 
      success: false, 
      error: "Backend configuration incomplete. Please set all required environment variables.",
      missing: {
        reddit: !!(REDDIT_CLIENT_ID && REDDIT_CLIENT_SECRET && REDDIT_USER_AGENT),
        perplexity: !!PERPLEXITY_API_KEY
      },
      alert: "Backend configuration incomplete. Please contact the administrator."
    });
  }
  try {
    console.log(`[Express] Starting Reddit access token retrieval for username: ${username}`);
    const accessToken = await getRedditAccessToken();
    console.log(`[Express] Access token obtained: ${accessToken ? '✅' : '❌'}`);
    let redditData;
    if (comprehensive) {
      console.log(`[Express] Fetching comprehensive user data for ${username}...`);
      redditData = await fetchComprehensiveUserData(username, accessToken);
      console.log(`[Express] Comprehensive user data fetched:`, JSON.stringify(redditData, null, 2));
    } else {
      console.log(`[Express] Fetching simple user data for ${username}...`);
      redditData = await fetchRedditUserData(username, accessToken);
      console.log(`[Express] Simple user data fetched:`, JSON.stringify(redditData, null, 2));
    }
    console.log(`[Express] Starting persona generation with Perplexity API...`);
    const persona = await generatePerplexityPersona(redditData);
    console.log(`[Express] Persona generated:`, JSON.stringify(persona, null, 2));

    // 1. Use exportPath from request
    const userExportPath = exportPath.trim();

    // 2. Create the folder if it doesn’t exist
    if (!fs.existsSync(userExportPath)) {
      fs.mkdirSync(userExportPath, { recursive: true });
    }

    // 3. Write TXT file
    const personaFilePath = path.join(userExportPath, `persona_output_${username}.txt`);
    let txtSuccess = true;
    try {
      fs.writeFileSync(personaFilePath, JSON.stringify(persona, null, 2), 'utf-8');
      console.log(`[Express] Persona exported to file: ${personaFilePath}`);
    } catch (err) {
      txtSuccess = false;
      console.error("❌ Error writing persona file:", err.message);
    }

    // 4. Write HTML file
    const personaHtmlFilePath = path.join(userExportPath, `persona_output_${username}.html`);
    let htmlSuccess = true;
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reddit Persona Report for ${persona.name}</title>
  <style>
    :root {
      --bg-dark: #0F1117;
      --card-bg: #1E212B;
      --accent: #FF4500;
      --highlight: #FFB020;
      --soft-purple: #A78BFA;
      --glass: rgba(255, 255, 255, 0.05);
    }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: var(--bg-dark);
      color: #E5E7EB;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 880px;
      margin: 50px auto;
      background: var(--card-bg);
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      padding: 40px;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 36px;
    }
    .avatar-symbol {
      background: var(--glass);
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: bold;
      color: var(--accent);
      text-shadow: 1px 1px 3px #000;
      box-shadow: inset 0 0 10px #00000055, 0 4px 20px #00000040;
    }
    .persona-info {
      flex: 1;
    }
    .persona-title {
      font-size: 2.4rem;
      font-weight: bold;
      color: var(--accent);
      margin-bottom: 6px;
    }
    .archetype {
      font-size: 1.2rem;
      color: var(--soft-purple);
      margin-bottom: 8px;
    }
    .info-row {
      margin-bottom: 6px;
    }
    .section {
      margin-top: 32px;
    }
    .section-title {
      font-size: 1.3rem;
      color: var(--highlight);
      font-weight: 600;
      margin-bottom: 12px;
    }
    .motivation, .personality-item, .behaviour-item, .frustration-item, .goal-item {
      margin-bottom: 6px;
    }
    .quote {
      background: var(--accent);
      color: white;
      padding: 18px;
      border-radius: 14px;
      font-size: 1.1rem;
      margin: 32px 0 16px;
      font-style: italic;
    }
    .simulated-post {
      background: var(--bg-dark);
      border: 1px solid #333;
      border-radius: 16px;
      padding: 20px;
      margin-top: 32px;
    }
    .sim-title {
      color: var(--highlight);
      font-weight: 600;
      margin-bottom: 12px;
      font-size: 1.1rem;
    }
    .citations {
      background: var(--glass);
      border: 1px solid #444;
      border-radius: 16px;
      padding: 20px;
      margin-top: 32px;
    }
    .citation-group {
      margin-bottom: 16px;
    }
    .citation-title {
      color: var(--soft-purple);
      font-weight: 600;
    }
    .citation-text {
      color: #D1D5DB;
      font-style: italic;
      margin-left: 8px;
    }
    a {
      color: var(--highlight);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .footer {
      margin-top: 48px;
      font-size: 0.95rem;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container" id="persona-report">
    <div class="header">
      <div class="avatar-symbol">${persona.name?.[0]?.toUpperCase() || 'U'}</div>
      <div class="persona-info">
        <div class="persona-title">${persona.name}</div>
        <div class="archetype">${persona.archetype || ''}</div>
        <div class="info-row">Age: <b>${persona.age}</b></div>
        <div class="info-row">Occupation: <b>${persona.occupation}</b></div>
        <div class="info-row">Status: <b>${persona.status || ''}</b></div>
        <div class="info-row">Location: <b>${persona.location}</b></div>
        <div class="info-row">Tier: <b>${persona.tier || ''}</b></div>
      </div>
    </div>
    <div class="quote">${persona.quote || '“The journey defines the user.”'}</div>
    <div class="section motivations">
      <div class="section-title">Motivations</div>
      ${Object.entries(persona.motivations || {}).map(([k, v]) => `<div class="motivation">${k.charAt(0).toUpperCase() + k.slice(1)}: <b>${v}/5</b></div>`).join('')}
    </div>
    <div class="section personality">
      <div class="section-title">Personality</div>
      ${Object.entries(persona.personality || {}).map(([k, v]) => `<div class="personality-item">${k.charAt(0).toUpperCase() + k.slice(1)}: <b>${v}/5</b></div>`).join('')}
    </div>
    <div class="section behaviour">
      <div class="section-title">Behaviour & Habits</div>
      ${(persona.behaviour || []).map(item => `<div class="behaviour-item">• ${item}</div>`).join('')}
    </div>
    <div class="section frustrations">
      <div class="section-title">Frustrations</div>
      ${(persona.frustrations || []).map(item => `<div class="frustration-item">• ${item}</div>`).join('')}
    </div>
    <div class="section goals">
      <div class="section-title">Goals & Needs</div>
      ${(persona.goals || []).map(item => `<div class="goal-item">• ${item}</div>`).join('')}
    </div>
    <div class="section simulated-post">
      <div class="sim-title">AI Post Simulation</div>
      <div>${persona.simulated_post || 'No simulated post available.'}</div>
    </div>
    <div class="section citations">
      <div class="section-title">Citations</div>
      ${(persona.citations ? Object.entries(persona.citations).map(([trait, citation]) => `
        <div class="citation-group">
          <span class="citation-title">${trait.charAt(0).toUpperCase() + trait.slice(1)}:</span>
          <span class="citation-text">"${citation.text}"</span>
          ${citation.link ? ` <a href="${citation.link}" target="_blank">[source]</a>` : ''}
        </div>`).join('') : '<i>No citations available.</i>')}
    </div>
    <div class="footer">Persona generated by <b>Reddit Soul Scribe</b> &bull; AI-powered insights &bull; ${new Date().toLocaleDateString()}</div>
  </div>
</body>
</html>`;
    try {
      fs.writeFileSync(personaHtmlFilePath, htmlContent, 'utf-8');
      console.log(`[Express] Persona HTML exported to file: ${personaHtmlFilePath}`);
    } catch (err) {
      htmlSuccess = false;
      console.error("❌ Error writing HTML file:", err.message);
    }

    let alertMsg;
    if (txtSuccess && htmlSuccess) {
      alertMsg = `Persona exported successfully to: ${userExportPath}`;
    } else if (!txtSuccess && !htmlSuccess) {
      alertMsg = `Failed to export persona files. Please check the export location and permissions.`;
    } else if (!txtSuccess) {
      alertMsg = `TXT file export failed, but HTML export succeeded. Check permissions for: ${personaFilePath}`;
    } else {
      alertMsg = `HTML file export failed, but TXT export succeeded. Check permissions for: ${personaHtmlFilePath}`;
    }

    res.json({
      success: txtSuccess && htmlSuccess,
      data: {
        redditData,
        persona,
        personaFilePath,
        personaHtmlFilePath,
        simulated_post: persona.simulated_post,
        portrait_url: persona.portrait_url,
        citations: persona.citations
      },
      alert: alertMsg
    });
    console.log(`[Express] Response sent for /api/analyze.`);
  } catch (error) {
    const status = error?.status || error?.response?.status;
    const redditError = error?.reddit || error?.response?.data || error.message;
    console.error("Error in /api/analyze:", redditError);
    console.error("Full error object:", error);
    res.status(status || 500).json({ success: false, error: redditError, details: error, alert: `Failed to export persona: ${redditError}` });
  }
});

app.post("/api/simulate-post", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }
  try {
    const accessToken = await getRedditAccessToken();
    const redditData = await fetchComprehensiveUserData(username, accessToken);
    const prompt = `Given the following Reddit user data, generate a single simulated Reddit post this user might write, based on their persona and writing style. Return only the post as plain text.\n\nUser data:\n${JSON.stringify(redditData)}`;
    const payload = {
      model: 'sonar',
      messages: [
        { role: 'system', content: 'You are a world-class user persona analyst.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 400,
      temperature: 0.7
    };
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );
    const content = response.data.choices?.[0]?.message?.content || response.data.choices?.[0]?.text || '';
    res.json({ success: true, simulated_post: content.trim() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// New endpoint for getting comprehensive user data without persona generation
app.get("/api/user/:username", async (req, res) => {
  const { username } = req.params;
  const { limit = 25 } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    console.log(`[Express] /api/user/:username request received for username: ${username}`);
    const accessToken = await getRedditAccessToken();
    console.log(`[Express] Access token obtained.`);
    const userData = await fetchComprehensiveUserData(username, accessToken, parseInt(limit));
    console.log(`[Express] All data fetched for ${username}.`);
    // Force persona generation for debugging
    let persona = null;
    try {
      console.log(`[Express] Forcing persona generation for ${username} using Perplexity API...`);
      persona = await generatePerplexityPersona(userData);
      console.log(`[Express] Persona generated for ${username}:`, JSON.stringify(persona, null, 2));
    } catch (personaErr) {
      console.error(`[Express] Persona generation failed for ${username}:`, personaErr?.message || personaErr);
    }
    res.json({
      success: true,
      data: userData,
      persona: persona,
    });
  } catch (error) {
    const status = error?.status || error?.response?.status;
    const redditError = error?.reddit || error?.response?.data || error.message;
    console.error("Error in /api/user/:username:", redditError);
    console.error("Full error object:", error);
    res.status(status || 500).json({ success: false, error: redditError, details: error });
  }
});

// New endpoint for getting user's posts
app.get("/api/user/:username/posts", async (req, res) => {
  const { username } = req.params;
  const { limit = 25, sort = "top", time = "year" } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    console.log(`[Express] /api/user/:username/posts request received for username: ${username}`);
    const accessToken = await getRedditAccessToken();
    console.log(`[Express] Access token obtained.`);
    const cleanUsername = username.replace(/^u\//i, "").trim();
    
    const response = await axios.get(
      `https://oauth.reddit.com/user/${cleanUsername}/submitted?limit=${limit}&sort=${sort}&t=${time}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": REDDIT_USER_AGENT,
        },
      }
    );

    const posts = response.data.data.children.map((post) => ({
      id: post.data.id,
      title: post.data.title,
      content: post.data.selftext || "",
      subreddit: post.data.subreddit,
      score: post.data.score,
      upvote_ratio: post.data.upvote_ratio,
      num_comments: post.data.num_comments,
      created_utc: post.data.created_utc,
      url: post.data.url,
      is_self: post.data.is_self,
      domain: post.data.domain,
      permalink: post.data.permalink,
    }));

    res.json({
      success: true,
      data: {
        username: cleanUsername,
        posts,
        total: posts.length,
      },
    });
  } catch (error) {
    const status = error?.status || error?.response?.status;
    const redditError = error?.reddit || error?.response?.data || error.message;
    console.error("Error in /api/user/:username/posts:", redditError);
    console.error("Full error object:", error);
    res.status(status || 500).json({ success: false, error: redditError, details: error });
  }
});

// New endpoint for getting user's comments
app.get("/api/user/:username/comments", async (req, res) => {
  const { username } = req.params;
  const { limit = 25, sort = "top", time = "year" } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    console.log(`[Express] /api/user/:username/comments request received for username: ${username}`);
    const accessToken = await getRedditAccessToken();
    console.log(`[Express] Access token obtained.`);
    const cleanUsername = username.replace(/^u\//i, "").trim();
    
    const response = await axios.get(
      `https://oauth.reddit.com/user/${cleanUsername}/comments?limit=${limit}&sort=${sort}&t=${time}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": REDDIT_USER_AGENT,
        },
      }
    );

    const comments = response.data.data.children.map((comment) => ({
      id: comment.data.id,
      content: comment.data.body,
      subreddit: comment.data.subreddit,
      score: comment.data.score,
      created_utc: comment.data.created_utc,
      parent_id: comment.data.parent_id,
      link_id: comment.data.link_id,
      permalink: comment.data.permalink,
    }));

    res.json({
      success: true,
      data: {
        username: cleanUsername,
        comments,
        total: comments.length,
      },
    });
  } catch (error) {
    const status = error?.status || error?.response?.status;
    const redditError = error?.reddit || error?.response?.data || error.message;
    console.error("Error in /api/user/:username/comments:", redditError);
    console.error("Full error object:", error);
    res.status(status || 500).json({ success: false, error: redditError, details: error });
  }
});

// New endpoint for getting user's overview (mixed content)
app.get("/api/user/:username/overview", async (req, res) => {
  const { username } = req.params;
  const { limit = 25 } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    console.log(`[Express] /api/user/:username/overview request received for username: ${username}`);
    const accessToken = await getRedditAccessToken();
    console.log(`[Express] Access token obtained.`);
    const cleanUsername = username.replace(/^u\//i, "").trim();
    
    const response = await axios.get(
      `https://oauth.reddit.com/user/${cleanUsername}/overview?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": REDDIT_USER_AGENT,
        },
      }
    );

    const items = response.data.data.children.map((item) => ({
      id: item.data.id,
      type: item.data.kind === 't3' ? 'post' : 'comment',
      title: item.data.title || item.data.body?.substring(0, 100) + '...',
      content: item.data.selftext || item.data.body || "",
      subreddit: item.data.subreddit,
      score: item.data.score,
      created_utc: item.data.created_utc,
      permalink: item.data.permalink,
    }));

    res.json({
      success: true,
      data: {
        username: cleanUsername,
        items,
        total: items.length,
      },
    });
  } catch (error) {
    const status = error?.status || error?.response?.status;
    const redditError = error?.reddit || error?.response?.data || error.message;
    console.error("Error in /api/user/:username/overview:", redditError);
    console.error("Full error object:", error);
    res.status(status || 500).json({ success: false, error: redditError, details: error });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 