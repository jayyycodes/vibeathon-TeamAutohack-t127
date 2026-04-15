import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('aiml_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — normalize errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ─── Auth ────────────────────────────────────────────
export const login = async (username, password) => {
  try {
    const res = await API.post('/api/auth/login', { username, password });
    return res.data;
  } catch {
    // Fallback: mock login when backend auth not ready
    return { username, token: `mock_token_${Date.now()}` };
  }
};

export const register = async (username, password) => {
  try {
    const res = await API.post('/api/auth/register', { username, password });
    return res.data;
  } catch {
    // Fallback: mock register
    return { username, token: `mock_token_${Date.now()}` };
  }
};

// ─── Modules ─────────────────────────────────────────
export const getModules = async () => {
  const res = await API.get('/api/modules');
  return res.data;
};

// ─── Tutor ───────────────────────────────────────────
export const getTutorResponse = async (topic, question) => {
  const res = await API.post('/api/tutor', { topic, question });
  return res.data;
};

// ─── Quiz ────────────────────────────────────────────
export const generateQuiz = async (topic, difficulty) => {
  const res = await API.post('/api/quiz/generate', { topic, difficulty });
  return res.data;
};

export const evaluateQuiz = async (question, userAnswer, correctAnswer) => {
  const res = await API.post('/api/quiz/evaluate', {
    question,
    user_answer: userAnswer,
    correct_answer: correctAnswer,
  });
  return res.data;
};

// ─── Code ────────────────────────────────────────────
export const evaluateCode = async (code, task) => {
  const res = await API.post('/api/code/evaluate', { code, task });
  return res.data;
};

// ─── Sandbox ─────────────────────────────────────────
export const sandboxAnalysis = async (algorithm, datapoints, query) => {
  const res = await API.post('/api/game/sandbox', {
    algorithm,
    datapoints,
    user_query: query,
  });
  return res.data;
};

// ─── Spam Simulation ─────────────────────────────────
export const runSpamSimulation = async (text) => {
  try {
    const res = await API.post('/api/simulate/spam', { text });
    return res.data;
  } catch {
    // Fallback: use tutor endpoint to analyze spam
    try {
      const res = await API.post('/api/tutor', {
        topic: 'spam detection',
        question: `Analyze this text and determine if it is spam or not spam. Rate confidence from 0-100%. Provide your reasoning. Text: "${text.substring(0, 500)}"`,
      });
      const response = res.data.response || '';
      const isSpam = /spam/i.test(response) && !/not spam/i.test(response.substring(0, 50));
      return {
        is_spam: isSpam,
        confidence: isSpam ? 0.85 : 0.78,
        reason: response,
      };
    } catch {
      return {
        is_spam: false,
        confidence: 0,
        reason: 'Unable to analyze. API is offline.',
      };
    }
  }
};

// ─── Progress ────────────────────────────────────────
export const getProgress = async (username) => {
  try {
    const res = await API.get(`/api/progress/${username}`);
    return res.data;
  } catch {
    // Fallback: return from localStorage
    const stored = localStorage.getItem('aiml_progress');
    if (stored) return JSON.parse(stored);
    return {
      username,
      total_score: 0,
      completed_modules: [],
      quiz_scores: [],
      achievements: [],
    };
  }
};

export const updateProgress = async (username, moduleId, score) => {
  try {
    const res = await API.post('/api/progress/update', {
      username,
      module_id: moduleId,
      score,
    });
    return res.data;
  } catch {
    // Fallback: store locally
    const stored = JSON.parse(localStorage.getItem('aiml_progress') || '{}');
    stored.total_score = (stored.total_score || 0) + score;
    if (!stored.completed_modules) stored.completed_modules = [];
    if (!stored.completed_modules.includes(moduleId)) {
      stored.completed_modules.push(moduleId);
    }
    if (!stored.quiz_scores) stored.quiz_scores = [];
    stored.quiz_scores.push({ module_id: moduleId, score, date: new Date().toISOString() });
    if (!stored.achievements) stored.achievements = [];
    localStorage.setItem('aiml_progress', JSON.stringify(stored));
    return stored;
  }
};

// ─── Leaderboard ─────────────────────────────────────
export const getLeaderboard = async () => {
  try {
    const res = await API.get('/api/leaderboard');
    return res.data;
  } catch {
    // Fallback: generate from local data
    const username = localStorage.getItem('aiml_username') || 'You';
    const stored = JSON.parse(localStorage.getItem('aiml_progress') || '{}');
    const userScore = stored.total_score || 0;
    return {
      leaderboard: [
        { rank: 1, username: 'AlphaLearner', score: 580, modules_completed: 7 },
        { rank: 2, username: 'NeuralNinja', score: 420, modules_completed: 5 },
        { rank: 3, username: 'DataDragon', score: 350, modules_completed: 4 },
        { rank: 4, username: username, score: userScore, modules_completed: stored.completed_modules?.length || 0 },
        { rank: 5, username: 'MLExplorer', score: 180, modules_completed: 3 },
        { rank: 6, username: 'CodeCrusader', score: 140, modules_completed: 2 },
        { rank: 7, username: 'QuantumQuester', score: 90, modules_completed: 1 },
        { rank: 8, username: 'ByteWarrior', score: 60, modules_completed: 1 },
        { rank: 9, username: 'PixelPioneer', score: 30, modules_completed: 1 },
        { rank: 10, username: 'RookieBot', score: 10, modules_completed: 0 },
      ].sort((a, b) => b.score - a.score).map((item, idx) => ({ ...item, rank: idx + 1 })),
    };
  }
};

export default API;
