# 🚀 Reddit Soul Scribe

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen" />
  <img src="https://img.shields.io/badge/React-18-blue" />
  <img src="https://img.shields.io/badge/Python-3.8%2B-yellow" />
  <img src="https://img.shields.io/badge/AI-Powered-red" />
  <img src="https://img.shields.io/badge/License-MIT-blue" />
</p>

<h1 align="center">Reddit Soul Scribe</h1>
<p align="center"><b>Uncover the soul behind any Reddit username with AI-powered persona generation, beautiful UI, and user-driven export.</b></p>

---

## ✨ What is Reddit Soul Scribe?

**Reddit Soul Scribe** is a next-level, full-stack AI app that transforms any Reddit username into a detailed, psychologically rich persona. Powered by advanced AI (Perplexity API), it analyzes real Reddit activity and crafts a stunning, interactive report—ready for download wherever you want it.

---

## 🌟 Features

- 🔍 **Deep Reddit Analysis**: Fetches posts, comments, and user stats for any Redditor
- 🤖 **AI Persona Generation**: Uses Perplexity AI to create a rich, JSON-backed persona
- 🎨 **Gorgeous UI**: Modern, dark/light themed React interface with smooth UX
- 💾 **User-Driven Export**: Choose your own export location for persona files (TXT & HTML)
- 📄 **Instant Download**: Download beautiful persona reports, ready to share or print
- 🐍 **Python CLI**: Batch persona generation with a single command
- 🛡️ **Robust Error Handling**: Friendly alerts and clear troubleshooting
- 🚦 **Live Status**: Real-time backend/AI status indicators

---

## 🖼️ Visual Preview

<p align="center">
  <img src="https://user-images.githubusercontent.com/your-screenshot.png" alt="Reddit Soul Scribe Screenshot" width="700"/>
</p>

---

## ⚡ Quickstart

### 1. Clone & Install
```bash
git clone https://github.com/yashjadhav1595-projects/reddit-soul-scribe1.git
cd reddit-soul-scribe1
npm install
```

### 2. Configure Environment
Create a `.env` in the root:
```
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=your_user_agent
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
PERPLEXITY_API_KEY=your_perplexity_api_key
```

### 3. Start Backend
```bash
cd backend
node server.js
```

### 4. Start Frontend
```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3001](http://localhost:3001)

---

## 🐍 Python CLI: Batch Persona Generation

- Requirements: Python 3.8+, `requests` (`pip install -r requirements.txt`)
- Usage:
  ```bash
  python generate_persona.py <reddit_username>
  ```
- Output: `persona_<username>.txt` in your chosen directory

---

## 💡 How It Works

1. **Enter a Reddit username**
2. **Choose where to save the persona files** (you pick the folder!)
3. **AI analyzes the user** and generates a beautiful persona report
4. **Download and share** your persona as TXT or HTML

---

## 🛠️ Tech Stack
- **Frontend:** React 18, TailwindCSS, Vite
- **Backend:** Node.js 18+, Express, Axios
- **AI:** Perplexity API
- **Reddit API** for data
- **Python** for CLI/batch

---

## 🏆 Showcase
- **Modern UI**: Responsive, dark/light, animated
- **Export Anywhere**: User picks the export folder—no more hunting for downloads!
- **AI-Powered**: Real, explainable personas with citations
- **Instant Feedback**: Alerts, spinners, and status badges

---

## 🧩 Troubleshooting
- Double-check your `.env` and API keys
- Make sure both backend and frontend are running
- For CORS/network errors, check ports and firewall
- For export issues, ensure you have write permissions to the chosen folder

---

## 👨‍💻 Author
- [yashjadhav1595-projects](https://github.com/yashjadhav1595-projects)

---

<p align="center"><b>✨ Unleash the soul of Reddit—one username at a time! ✨</b></p>

