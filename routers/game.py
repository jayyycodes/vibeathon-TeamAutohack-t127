from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from routers.grok_client import get_client, GROQ_MODEL

router = APIRouter()


class SandboxRequest(BaseModel):
    algorithm: str
    datapoints: List[List[float]]
    user_query: str


@router.post("/game/sandbox")
def game_sandbox(req: SandboxRequest):
    try:
        client = get_client()
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an ML algorithm narrator. Given an algorithm name, "
                        "datapoints, and a user query, explain what happens "
                        "step-by-step in 2-3 concise sentences. Be visual and intuitive."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Algorithm: {req.algorithm}\n"
                        f"Datapoints: {req.datapoints}\n"
                        f"Query: {req.user_query}"
                    ),
                },
            ],
            max_tokens=150,
            temperature=0.6,
        )
        return {"narration": response.choices[0].message.content}
    except Exception as e:
        error_msg = str(e)
        if "api_key" in error_msg.lower() or "auth" in error_msg.lower() or "incorrect" in error_msg.lower():
            raise HTTPException(
                status_code=503,
                detail="AI service authentication failed. Please check GROQ_API_KEY in .env"
            )
        raise HTTPException(status_code=500, detail=f"Sandbox error: {error_msg}")
