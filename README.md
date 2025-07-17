# Reddit Soul Scribe 

![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Python](https://img.shields.io/badge/Python-3.8%2B-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Project Overview

**Reddit Soul Scribe** is a full-stack AI-powered Reddit persona generator. It fetches Reddit user data, analyzes it with advanced AI (Perplexity API), and generates a detailed psychological persona. The project features a modern React frontend, robust Node.js/Express backend, and a Python script for batch persona generation.

---

## 🚀 Features
- Fetches comprehensive Reddit user data (profile, posts, comments, overview)
- Generates advanced personas using the Perplexity API
- Modern, responsive UI with dark/light mode
- Automatic persona generation and status feedback
- Download persona as .txt file
- Python script for command-line persona generation
- Detailed logging and error handling

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yashjadhav1595-projects/reddit-soul-scribe1.git
cd reddit-soul-scribe
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root with your Reddit and Perplexity API credentials:
```
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=your_user_agent
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
PERPLEXITY_API_KEY=your_perplexity_api_key
```

### 4. Start the Backend
```bash
cd backend
node server.js
```
The backend will run on [http://localhost:3001](http://localhost:3001)

### 5. Start the Frontend
```bash
npm run dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173) (or as shown in your terminal)

---

## 🐍 Python Script: Persona Generation

### Requirements
- Python 3.8+
- `requests` library (`pip install requirements.txt`)

### Usage
```bash
python generate_persona.py <reddit_username >
```
- This will fetch the persona for the given Reddit user and save it as `persona_<username>.txt` in the current directory.

### Example
```bash
python generate_persona.py StationLevel1840
```

---

## 🖥️ Example Output

- Reddit user data and persona are shown in the frontend for comparison.
- Persona .txt files are generated for each analyzed user.


---

## 🛠️ Troubleshooting
- Ensure your `.env` file is correctly configured and the backend is running before using the Python script or frontend.
- If you see CORS or network errors, check that both backend and frontend are running on the correct ports.
- For API errors, check your Reddit and Perplexity API credentials.

---

## 👨‍💻 Author
- [yashjadhav1595-projects](https://github.com/yashjadhav1595-projects)

