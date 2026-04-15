# AIML Quest Backend

Gamified ML Learning Platform — FastAPI backend powered by Grok AI.

## Setup

```bash
# 1. Clone and enter the directory
cd aiml-quest-backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
copy .env.example .env
# Edit .env and add your Grok API key

# 5. Run the server
uvicorn main:app --reload --port 8000
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROK_API_KEY` | API key from [x.ai](https://x.ai) | Yes |

## API Endpoints

Base URL: `http://localhost:8000`

---

### `GET /` — Health Check
**Response:** `{ "status": "ok", "service": "aiml-quest-backend" }`

---

### `POST /api/tutor` — Socratic AI Tutor
**Body:**
```json
{ "topic": "linear regression", "question": "How does it work?" }
```
**Response:**
```json
{ "response": "Linear regression finds the best-fit line..." }
```

---

### `POST /api/quiz/generate` — Generate MCQ Quiz
**Body:**
```json
{ "topic": "neural networks", "difficulty": "easy" }
```
**Response:**
```json
{
  "quiz": [
    {
      "question": "What is a neuron?",
      "options": ["A: ...", "B: ...", "C: ...", "D: ..."],
      "correct": "A",
      "explanation": "..."
    }
  ]
}
```

---

### `POST /api/quiz/evaluate` — Evaluate Quiz Answer
**Body:**
```json
{
  "question": "What is a neuron?",
  "user_answer": "A",
  "correct_answer": "A"
}
```
**Response:**
```json
{ "is_correct": true, "explanation": "A neuron is the basic unit..." }
```

---

### `POST /api/code/evaluate` — ML Code Review
**Body:**
```json
{
  "code": "from sklearn.linear_model import LinearRegression\n...",
  "task": "Train a linear regression model on housing data"
}
```
**Response:**
```json
{ "score": 7, "feedback": "Good structure but...", "fix": "Add feature scaling..." }
```

---

### `GET /api/modules` — Learning Path
**Response:**
```json
{
  "modules": [
    { "id": 1, "title": "ML Basics", "description": "...", "difficulty": "easy", "estimated_time": "2 hours" }
  ]
}
```

---

### `POST /api/game/sandbox` — Algorithm Sandbox
**Body:**
```json
{
  "algorithm": "k-means",
  "datapoints": [[1, 2], [3, 4], [5, 6]],
  "user_query": "How does it cluster these points?"
}
```
**Response:**
```json
{ "narration": "K-means starts by randomly placing 2 centroids..." }
```

## Tech Stack

- **FastAPI** — async Python web framework
- **Grok AI** — LLM via OpenAI-compatible SDK
- **Uvicorn** — ASGI server
- **In-memory store** — centralized `routers/store.py` for users & progress

---

## New API Endpoints (v2)

---

### `POST /api/auth/register` — Register User
**Body:**
```json
{ "username": "jaish", "password": "test123" }
```
**Response:**
```json
{ "success": true, "token": "amFpc2g=" }
```

---

### `POST /api/auth/login` — Login User
**Body:**
```json
{ "username": "jaish", "password": "test123" }
```
**Response:**
```json
{ "success": true, "token": "amFpc2g=" }
```

---

### `POST /api/progress/update` — Update Progress
**Body:**
```json
{ "username": "jaish", "module_id": 1, "score": 85 }
```
**Response:**
```json
{ "updated": true, "total_score": 85 }
```

---

### `GET /api/progress/{username}` — Get User Progress
**Response:**
```json
{
  "completed": [1, 2],
  "scores": {"1": 85, "2": 90},
  "total_score": 175
}
```

---

### `GET /api/leaderboard` — Top 10 Leaderboard
**Response:**
```json
[
  { "rank": 1, "username": "jaish", "total_score": 175, "completed_count": 2 }
]
```

---

### `POST /api/simulate/spam` — Spam Classifier
**Body:**
```json
{ "text": "BUY NOW! FREE MONEY!!!" }
```
**Response:**
```json
{ "is_spam": true, "confidence": 0.95, "reason": "Contains spam trigger words..." }
```

---

### `POST /api/code/run` — Simulate Code Execution
**Body:**
```json
{ "code": "print('hello')", "language": "python" }
```
**Response:**
```json
{ "output": "hello", "explanation": "The code prints the string 'hello' to stdout." }
```

