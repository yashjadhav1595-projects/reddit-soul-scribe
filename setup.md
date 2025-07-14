# 🚀 Reddit Soul Scribe - Quick Setup Guide

## Prerequisites
- Node.js 18+ and npm
- Git

## Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd reddit-soul-scribe
npm install
```

### 2. Environment Setup
```bash
# Copy the environment template
cp env.example .env

# Edit .env with your API keys (optional for demo mode)
```

### 3. Start the Application

**Option A: Demo Mode (No API Keys Required)**
```bash
# Start frontend only
npm run dev
```
Navigate to `http://localhost:8080`

**Option B: Full AI Mode (Requires API Keys)**
```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev
```

## 🔑 API Keys Setup (Optional)

### Together.ai API Key
1. Sign up at [Together.ai](https://together.ai)
2. Get your API key from the dashboard
3. Add to `.env`:
```env
TOGETHER_API_KEY=your_api_key_here
```

### Reddit API (For Production)
1. Create a Reddit app at [Reddit Apps](https://www.reddit.com/prefs/apps)
2. Add credentials to `.env`:
```env
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=UserPersonaScript/0.1 by your_username
```

## 🎯 Features Available

### Demo Mode (Default)
- ✅ Beautiful UI with dark/light mode
- ✅ Progressive loading animations
- ✅ Pinnable personality traits
- ✅ Interactive citations
- ✅ Sample persona data

### Full AI Mode (With API Keys)
- ✅ Real Reddit data analysis
- ✅ AI-generated personas using Llama 3.3-70B
- ✅ Visual portraits using FLUX.1-schnell
- ✅ Post simulation using EXAONE-Deep-32B
- ✅ All demo features

## 🐛 Troubleshooting

### Backend Won't Start
- Check if port 3001 is available
- Ensure Node.js 18+ is installed
- Check console for error messages

### Frontend Issues
- Clear browser cache
- Check if port 8080 is available
- Ensure all dependencies are installed

### API Errors
- Verify API keys are correct
- Check Together.ai account status
- Ensure Reddit API credentials are valid

## 📞 Support
- Check the main README.md for detailed documentation
- Open an issue on GitHub for bugs
- Join our Discord for community support

---

**Happy analyzing! 🧠✨** 