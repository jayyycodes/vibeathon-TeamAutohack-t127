<p align="center">
  <h1 align="center">🧠 AIML Quest</h1>
  <p align="center">A Gamified, AI-Powered Machine Learning Learning Platform</p>
  <p align="center">
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
    <img src="https://img.shields.io/badge/Groq-FF6600?style=for-the-badge&logo=groq&logoColor=white" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  </p>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Frontend Screens](#-frontend-screens)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)

---

## 🎯 Overview

**AIML Quest** is a full-stack, gamified platform that teaches Machine Learning through interactive, AI-driven experiences. Instead of passive video lectures, users learn by doing — chatting with an AI tutor, generating adaptive quizzes, writing and running real ML code in-browser, visualizing algorithms on a canvas, and detecting spam with AI classification.

Built for the **Vibeathon Hackathon**, it demonstrates how large language models can be integrated into education to create personalized, engaging learning experiences.

---

## 🔍 Problem Statement

Learning Machine Learning is intimidating for beginners:

- **Static content** — Traditional courses offer one-size-fits-all lessons with no personalization
- **No hands-on practice** — Students read about algorithms but never experiment with them
- **Lack of feedback** — Learners write code with no way to evaluate quality
- **Low engagement** — No gamification, no progression tracking, no motivation to continue

---

## 💡 Solution

AIML Quest solves this by combining **AI-powered personalization** with **gamification**:

| Problem | AIML Quest Solution |
|---------|-------------------|
| Static content | **AI Tutor** — Socratic-style conversations personalized to each learner |
| No practice | **Code Lab** — Write and run Python ML code in-browser with Pyodide |
| No feedback | **AI Code Review** — LLM evaluates code quality and suggests improvements |
| Low engagement | **XP System + Leaderboard** — Earn points, track progress, compete |
| Abstract concepts | **ML Sandbox** — Visual, interactive algorithm playground |
| No assessments | **AI Quiz Generator** — Adaptive MCQs generated per topic and difficulty |

### How It Works

```
User picks a topic → AI generates personalized content → User interacts (quiz/code/sandbox)
     → AI evaluates responses → XP awarded → Progress tracked → Leaderboard updated
```

The **Groq API** (running LLaMA 3.3 70B) powers all AI features with sub-second response times, making the experience feel real-time and interactive.

---

## ✨ Features

### 🎓 AI Tutor (Socratic Learning)
- Chat-based AI tutor that explains ML concepts
- Asks follow-up questions to deepen understanding
- Covers 7 structured modules from beginner to advanced
- Mark modules as complete to earn XP

### 📝 AI Quiz Generator
- Generates 5 custom MCQs per topic on-demand
- Three difficulty levels: Easy, Medium, Hard
- Quick-select topics: Neural Networks, Linear Regression, Decision Trees, NLP, Computer Vision
- AI-powered answer explanations
- Earn up to 50 XP per quiz

### 💻 Code Lab (In-Browser Python)
- Full Python runtime in the browser via **Pyodide** (WebAssembly)
- NumPy pre-loaded for ML computations
- 5 preset ML tasks: Linear Regression, KNN, Decision Tree, K-Means, Neural Network
- **Run code** locally — see real stdout output
- **AI Code Review** — Get a score (1-10), feedback, and improvement suggestions

### 🎮 ML Sandbox (Visual Algorithm Explorer)
- Interactive canvas — click to place data points
- Left-click for Class A (white), right-click for Class B (lime)
- Choose algorithm: KNN, Linear Regression, or Decision Tree
- AI narrates step-by-step how the algorithm would process your data
- Visual, intuitive learning

### 🛡️ Spam Detector (AI Classification Simulator)
- Paste any text or email for AI spam analysis
- Pre-built presets: Phishing Email, Normal Email, Promo Spam
- Returns: classification (spam/not spam), confidence score, and reasoning
- Visual confidence bar with color-coded results

### 📊 Progress & Gamification
- XP-based scoring system across all activities
- Module completion tracking
- Personal dashboard with total XP display
- Persistent progress (localStorage fallback when offline)

### 🏆 Leaderboard
- Top 10 rankings with scores and completed module counts
- Real-time updates from backend
- Graceful fallback with sample data when offline

### 🔐 Authentication
- Simple username/password registration and login
- Token-based session management
- Protected routes — all features require login

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│                   React + Vite + Tailwind                    │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Auth    │ │  Home    │ │  Learn   │ │  Tutor   │       │
│  │  Screen  │ │  Screen  │ │  Screen  │ │  Screen  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Quiz   │ │  Code   │ │ Sandbox  │ │ Simulate │       │
│  │  Screen  │ │  Lab    │ │  Screen  │ │  Screen  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐                                  │
│  │ Leader  │ │Dashboard │      services/api.js              │
│  │  board   │ │  Screen  │   (Axios → Backend)              │
│  └──────────┘ └──────────┘                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP (REST)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                       BACKEND                               │
│                FastAPI + Uvicorn/Gunicorn                    │
│                                                             │
│  main.py ─── CORS ─── Router Registration                   │
│       │                                                     │
│       ├── /api/auth/*      → auth.py       (register/login) │
│       ├── /api/tutor       → tutor.py      (AI chat)        │
│       ├── /api/quiz/*      → quiz.py       (generate/eval)  │
│       ├── /api/code/*      → code.py       (evaluate/run)   │
│       ├── /api/modules     → modules.py    (learning path)  │
│       ├── /api/game/*      → game.py       (sandbox AI)     │
│       ├── /api/simulate/*  → simulate.py   (spam detect)    │
│       ├── /api/progress/*  → progress.py   (XP tracking)    │
│       └── /api/leaderboard → leaderboard.py (rankings)      │
│                                                             │
│  grok_client.py ── OpenAI SDK ──→ Groq API (LLaMA 3.3 70B) │
│  store.py ───────── In-memory dict (users, progress)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Python 3.11+** | Runtime |
| **FastAPI** | Async REST API framework |
| **Uvicorn** | ASGI development server |
| **Gunicorn** | Production WSGI/ASGI server |
| **OpenAI SDK** | Client for Groq API (OpenAI-compatible) |
| **Groq API** | LLM inference (LLaMA 3.3 70B Versatile) |
| **python-dotenv** | Environment variable management |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite 8** | Build tool and dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **React Router 7** | Client-side routing |
| **Axios** | HTTP client |
| **Recharts** | Data visualization (dashboard charts) |
| **Pyodide** | In-browser Python execution (WASM) |

---

## 📂 Project Structure

```
aiml-quest-backend/
├── main.py                    # FastAPI app entry point, CORS, router registration
├── requirements.txt           # Python dependencies
├── Procfile                   # Production server command (Render/Railway)
├── .env                       # Environment variables (gitignored)
├── .env.example               # Template for .env
├── .gitignore
│
├── routers/
│   ├── __init__.py
│   ├── grok_client.py         # Groq API client singleton (OpenAI SDK)
│   ├── store.py               # In-memory data store (users, progress)
│   ├── auth.py                # POST /auth/register, /auth/login
│   ├── tutor.py               # POST /tutor (Socratic AI conversations)
│   ├── quiz.py                # POST /quiz/generate, /quiz/evaluate
│   ├── code.py                # POST /code/evaluate, /code/run
│   ├── modules.py             # GET /modules (learning path)
│   ├── game.py                # POST /game/sandbox (algorithm narration)
│   ├── simulate.py            # POST /simulate/spam (spam classification)
│   ├── progress.py            # GET/POST /progress (XP tracking)
│   └── leaderboard.py         # GET /leaderboard (top 10)
│
└── Frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── .env.example             # Frontend env template
    └── src/
        ├── main.jsx             # React entry point
        ├── App.jsx              # Router + protected routes
        ├── index.css            # Global styles + design system
        ├── context/
        │   └── AuthContext.jsx  # Auth state provider
        ├── components/
        │   ├── Navbar.jsx       # Top navigation bar
        │   ├── ChatBubble.jsx   # Tutor chat message
        │   ├── QuizCard.jsx     # Quiz question card
        │   ├── ScoreCard.jsx    # Quiz results display
        │   ├── TopicCard.jsx    # Module selection card
        │   └── LoadingSpinner.jsx
        ├── screens/
        │   ├── AuthScreen.jsx       # Login / Register
        │   ├── HomeScreen.jsx       # Dashboard with feature grid
        │   ├── LearnScreen.jsx      # Module selection by difficulty
        │   ├── TutorScreen.jsx      # AI chat tutor
        │   ├── QuizScreen.jsx       # Quiz generator + player
        │   ├── CodeLabScreen.jsx    # Code editor + Pyodide runner
        │   ├── SandboxScreen.jsx    # Visual ML algorithm canvas
        │   ├── SimulateScreen.jsx   # Spam detection simulator
        │   ├── LeaderboardScreen.jsx
        │   └── DashboardScreen.jsx  # Personal progress view
        └── services/
            └── api.js            # Axios API client (all endpoints)
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+** — [Download](https://www.python.org/downloads/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **Groq API Key** — [Get one free](https://console.groq.com/keys)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/aiml-quest-backend.git
cd aiml-quest-backend
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env         # Windows
# cp .env.example .env         # Mac/Linux
```

**Edit `.env`** and add your Groq API key:
```env
GROQ_API_KEY=gsk_your_actual_key_here
```

```bash
# Start the backend server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### 4. Verify Everything Works

Open `http://localhost:8000/api/health` — you should see:
```json
{
  "backend": "ok",
  "groq_key_configured": true,
  "groq_api": "ok",
  "model": "llama-3.3-70b-versatile"
}
```

Open `http://localhost:5173` — the frontend app loads, register an account, and start learning!

---

## 📡 API Documentation

Base URL: `http://localhost:8000`

Interactive API docs: `http://localhost:8000/docs` (Swagger UI)

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Basic health check |
| `GET` | `/api/health` | Full health check (backend + Groq API status) |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login existing user |

**Request Body:**
```json
{ "username": "jaish", "password": "test123" }
```

**Response:**
```json
{ "success": true, "token": "amFpc2g=" }
```

### AI Tutor

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tutor` | Ask the Socratic AI Tutor a question |

**Request Body:**
```json
{ "topic": "linear regression", "question": "How does it work?" }
```

**Response:**
```json
{ "response": "Linear regression finds the best-fit line through your data..." }
```

### Quiz

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/quiz/generate` | Generate 5 MCQs for topic + difficulty |
| `POST` | `/api/quiz/evaluate` | Evaluate a user's answer |

**Generate Request:**
```json
{ "topic": "neural networks", "difficulty": "easy" }
```

**Generate Response:**
```json
{
  "quiz": [
    {
      "question": "What is a neuron in the context of neural networks?",
      "options": ["A: A basic computational unit", "B: A type of database", "C: A programming language", "D: A hardware chip"],
      "correct": "A",
      "explanation": "A neuron is the fundamental building block..."
    }
  ]
}
```

**Evaluate Request:**
```json
{ "question": "What is a neuron?", "user_answer": "A", "correct_answer": "A" }
```

**Evaluate Response:**
```json
{ "is_correct": true, "explanation": "A neuron is the basic computational unit..." }
```

### Code

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/code/evaluate` | AI code review (score + feedback) |
| `POST` | `/api/code/run` | Simulate code execution |

**Evaluate Request:**
```json
{
  "code": "from sklearn.linear_model import LinearRegression\n...",
  "task": "Train a linear regression model on housing data"
}
```

**Evaluate Response:**
```json
{ "score": 7, "feedback": "Good structure but missing feature scaling", "fix": "Add StandardScaler..." }
```

**Run Request:**
```json
{ "code": "print('hello')", "language": "python" }
```

**Run Response:**
```json
{ "output": "hello", "explanation": "The code prints the string 'hello' to stdout." }
```

### Learning Modules

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/modules` | Get all learning modules |

**Response:**
```json
{
  "modules": [
    { "id": 1, "title": "ML Basics", "description": "Core concepts...", "difficulty": "easy", "estimated_time": "2 hours" },
    { "id": 2, "title": "Supervised Learning", "difficulty": "easy", "estimated_time": "3 hours" },
    { "id": 3, "title": "Unsupervised Learning", "difficulty": "medium", "estimated_time": "3 hours" },
    { "id": 4, "title": "Neural Networks", "difficulty": "medium", "estimated_time": "4 hours" },
    { "id": 5, "title": "Deep Learning", "difficulty": "hard", "estimated_time": "5 hours" },
    { "id": 6, "title": "NLP", "difficulty": "hard", "estimated_time": "4 hours" },
    { "id": 7, "title": "Computer Vision", "difficulty": "hard", "estimated_time": "4 hours" }
  ]
}
```

### ML Sandbox

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/game/sandbox` | AI narration of algorithm behavior |

**Request Body:**
```json
{
  "algorithm": "KNN",
  "datapoints": [[100, 200], [250, 150], [300, 300]],
  "user_query": "I have 5 Class A and 3 Class B points. Explain how KNN would classify this data."
}
```

**Response:**
```json
{ "narration": "KNN starts by calculating the Euclidean distance from each unclassified point..." }
```

### Spam Detection

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/simulate/spam` | Classify text as spam or not |

**Request Body:**
```json
{ "text": "CONGRATULATIONS! You've won a FREE iPhone! Click here NOW!!!" }
```

**Response:**
```json
{ "is_spam": true, "confidence": 0.95, "reason": "Contains typical spam indicators: all-caps urgency, prize notification..." }
```

### Progress Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/progress/update` | Update user XP and completed modules |
| `GET` | `/api/progress/{username}` | Get user progress |

**Update Request:**
```json
{ "username": "jaish", "module_id": 1, "score": 85 }
```

### Leaderboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leaderboard` | Get top 10 users by score |

**Response:**
```json
[
  { "rank": 1, "username": "jaish", "total_score": 175, "completed_count": 2 }
]
```

---

## 🖥️ Frontend Screens

| Screen | Route | Description |
|--------|-------|-------------|
| **Auth** | `/` | Login & registration with toggle |
| **Home** | `/home` | Dashboard with feature grid + XP display |
| **Learn** | `/learn` | Module selection grouped by difficulty |
| **AI Tutor** | `/tutor?topic=...` | Real-time AI chat with Socratic teaching |
| **Quiz** | `/quiz` | Topic + difficulty selector → 5 MCQs → Score |
| **Code Lab** | `/codelab` | Split-pane code editor + output + AI review |
| **ML Sandbox** | `/sandbox` | Interactive canvas + algorithm selector + AI narration |
| **Spam Detector** | `/simulate` | Text input + preset emails + AI classification |
| **Leaderboard** | `/leaderboard` | Top 10 ranked users |
| **Dashboard** | `/dashboard` | Personal progress & achievements |

---

## 🌐 Deployment

### Backend → Render (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service** → Connect repo
3. Configure:
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
4. Add environment variable: `GROQ_API_KEY` = your key
5. Deploy → Get URL (e.g., `https://aiml-quest-backend.onrender.com`)

### Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → **Import Project** → Select repo
2. Set **Root Directory** to `Frontend`
3. Add environment variable: `VITE_API_URL` = your Render backend URL
4. Deploy → Your app is live!

### Alternative: Railway

1. Go to [railway.app](https://railway.app) → Connect GitHub repo
2. Railway auto-detects the `Procfile`
3. Add `GROQ_API_KEY` in the Variables tab
4. Deploy → Use the URL as `VITE_API_URL` in Vercel

---

## ⚙️ Environment Variables

### Backend (`.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | API key from [console.groq.com/keys](https://console.groq.com/keys) | ✅ Yes |

### Frontend (`.env` in `Frontend/`)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL (defaults to `http://localhost:8000`) | Only for production |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project was built for the **Vibeathon Hackathon**.

---

<p align="center">
  Built with ❤️ using FastAPI, React, and Groq AI
</p>
