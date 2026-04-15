from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import tutor, quiz, code, modules, game

app = FastAPI(
    title="AIML Quest API",
    description="Gamified ML Learning Platform Backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tutor.router, prefix="/api", tags=["Tutor"])
app.include_router(quiz.router, prefix="/api", tags=["Quiz"])
app.include_router(code.router, prefix="/api", tags=["Code"])
app.include_router(modules.router, prefix="/api", tags=["Modules"])
app.include_router(game.router, prefix="/api", tags=["Game"])


@app.get("/")
def health_check():
    return {"status": "ok", "service": "aiml-quest-backend"}
