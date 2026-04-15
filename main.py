import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import tutor, quiz, code, modules, game
from routers import auth, progress, leaderboard, simulate

app = FastAPI(
    title="AIML Quest API",
    description="Gamified ML Learning Platform Backend",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing routers
app.include_router(tutor.router, prefix="/api", tags=["Tutor"])
app.include_router(quiz.router, prefix="/api", tags=["Quiz"])
app.include_router(code.router, prefix="/api", tags=["Code"])
app.include_router(modules.router, prefix="/api", tags=["Modules"])
app.include_router(game.router, prefix="/api", tags=["Game"])

# New routers
app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(progress.router, prefix="/api", tags=["Progress"])
app.include_router(leaderboard.router, prefix="/api", tags=["Leaderboard"])
app.include_router(simulate.router, prefix="/api", tags=["Simulate"])


@app.get("/")
def health_check():
    return {"status": "ok", "service": "aiml-quest-backend"}


@app.get("/api/health")
def api_health():
    """Check backend + Groq API connectivity."""
    groq_key = os.getenv("GROQ_API_KEY", "")
    key_set = bool(groq_key) and groq_key != "YOUR_GROQ_API_KEY_HERE"

    result = {"backend": "ok", "groq_key_configured": key_set}

    if key_set:
        try:
            from routers.grok_client import get_client, GROQ_MODEL
            client = get_client()
            resp = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": "Say OK"}],
                max_tokens=5,
            )
            result["groq_api"] = "ok"
            result["model"] = GROQ_MODEL
        except Exception as e:
            result["groq_api"] = "error"
            result["groq_error"] = str(e)
    else:
        result["groq_api"] = "not_configured"

    return result
