# 🧠 Reddit Soul Scribe - AI-Powered Personality Analysis

> **Advanced Reddit persona generator with multi-modal AI, visual portraits, and reverse simulation**

[![Reddit](https://img.shields.io/badge/Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)](https://reddit.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Together.ai](https://img.shields.io/badge/Together.ai-000000?style=for-the-badge&logo=openai&logoColor=white)](https://together.ai)

## 🚀 Features

### 🧠 **AI-Powered Analysis**
- **Multi-Model AI Pipeline**: Uses Llama 3.3-70B for persona generation, FLUX.1-schnell for visual portraits, and EXAONE-Deep-32B for post simulation
- **Real Reddit Integration**: Fetches actual Reddit posts and comments using PRAW
- **Smart Prompt Engineering**: Optimized prompts for accurate personality analysis
- **Archetype Classification**: Categorizes users into personality archetypes (e.g., "The Curious Analyst", "The Empathetic Listener")

### 🎨 **Visual AI Features**
- **AI-Generated Portraits**: Creates stylized digital portraits based on personality traits
- **FLUX.1-schnell Integration**: High-quality image generation with Together.ai
- **Visual Prompt Optimization**: Converts personality traits into visual descriptions

### 🔄 **Reverse Persona Simulation**
- **Post Generation**: AI creates realistic Reddit posts that match the analyzed personality
- **Tone Matching**: Simulates communication style and writing patterns
- **Authenticity Validation**: Tests how well the persona analysis captures the user's voice

### 🎛️ **Advanced UX Features**
- **Dark/Light Mode**: Beautiful theme switching with system preference detection
- **Progressive Loading**: Multi-stage analysis visualization
- **Pinnable Traits**: Save important personality insights
- **Interactive Citations**: Hover to see source Reddit posts
- **Real-time Backend Status**: Shows when AI backend is online vs demo mode

### 🔧 **Technical Excellence**
- **Modular Architecture**: Clean separation between frontend and backend
- **Type Safety**: Comprehensive TypeScript interfaces
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Performance Optimized**: React Query for efficient data fetching
- **Responsive Design**: Mobile-first approach with beautiful animations

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom design system
- **shadcn/ui** component library
- **React Query** for state management
- **React Router** for navigation

### **Backend**
- **Node.js** with Express
- **PRAW** for Reddit API integration
- **Together.ai** for multi-model AI processing
- **Axios** for HTTP requests

### **AI Models**
- **meta-llama/Llama-3.3-70B-Instruct-Turbo-Free**: Persona generation
- **black-forest-labs/FLUX.1-schnell**: Visual portrait generation
- **lg-ai/EXAONE-Deep-32B**: Post simulation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Reddit API credentials
- Together.ai API key

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd reddit-soul-scribe
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env
```

Edit `.env` with your API keys:
```env
# Reddit API Configuration
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=UserPersonaScript/0.1 by your_username

# Together.ai API Configuration
TOGETHER_API_KEY=your_together_ai_api_key

# Server Configuration
PORT=3001
NODE_ENV=development
```

4. **Start the backend server**
```bash
npm run dev:backend
```

5. **Start the frontend development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:8080`

## 🎯 Usage

### **Basic Analysis**
1. Enter a Reddit username (e.g., `u/username` or just `username`)
2. Click "Analyze Profile" to start the AI analysis
3. View the generated persona with detailed insights

### **Advanced Features**
- **Visual Portrait**: See an AI-generated image of the persona
- **Post Simulation**: Generate realistic Reddit posts the user might write
- **Pinnable Traits**: Click the pin icon to save important insights
- **Citations**: Hover over quote icons to see source Reddit posts

### **Demo Mode**
If the backend is offline, the app automatically switches to demo mode with sample data.

## 🔧 Development

### **Project Structure**
```
reddit-soul-scribe/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── PersonaImage.tsx    # AI-generated portraits
│   │   ├── SimulatedPost.tsx   # Reverse persona simulation
│   │   └── ...
│   ├── lib/
│   │   ├── api.ts          # API service layer
│   │   └── utils.ts        # Utility functions
│   ├── pages/              # Page components
│   └── hooks/              # Custom React hooks
├── backend/
│   └── server.js           # Express backend server
├── public/                 # Static assets
└── package.json
```

### **Available Scripts**
```bash
npm run dev              # Start frontend development server
npm run dev:backend      # Start backend server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run preview          # Preview production build
```

### **API Endpoints**
- `POST /api/analyze` - Analyze Reddit user and generate persona
- `GET /api/health` - Backend health check

## 🎨 Customization

### **Adding New AI Models**
The backend supports multiple Together.ai models. Add new models in `backend/server.js`:

```javascript
// Add new model configuration
const MODEL_CONFIG = {
  'persona': 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
  'image': 'black-forest-labs/FLUX.1-schnell',
  'simulation': 'lg-ai/EXAONE-Deep-32B',
  'new-feature': 'your-model-name'
};
```

### **Customizing Prompts**
Edit prompt templates in `backend/server.js`:
- `createPersonaPrompt()` - Persona generation prompts
- `createVisualPrompt()` - Image generation prompts
- `createSimulationPrompt()` - Post simulation prompts

### **Styling**
The app uses Tailwind CSS with custom design tokens. Modify `src/index.css` for:
- Color schemes
- Animations
- Custom gradients
- Dark mode variables

## 🔐 Security & Privacy

- **No Data Storage**: Reddit data is processed in-memory and not stored
- **API Key Security**: Environment variables for sensitive credentials
- **Rate Limiting**: Built-in protection against API abuse
- **Error Handling**: Graceful handling of API failures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Reddit** for providing the API
- **Together.ai** for powerful AI models
- **shadcn/ui** for beautiful components
- **Lovable.dev** for the development platform

## 📞 Support

For support, email support@example.com or join our Discord server.

---

**Built with ❤️ for the Reddit community**
