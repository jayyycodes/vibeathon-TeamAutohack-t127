from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from routers.grok_client import get_client, GROQ_MODEL

router = APIRouter()


class TutorRequest(BaseModel):
    topic: str
    question: str


@router.post("/tutor")
def tutor_ask(req: TutorRequest):
    try:
        client = get_client()
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a Socratic ML tutor. Explain the concept clearly "
                        "in 2-3 sentences, then ask the user one thought-provoking "
                        "follow-up question to deepen understanding."
                    ),
                },
                {
                    "role": "user",
                    "content": f"Topic: {req.topic}\nQuestion: {req.question}",
                },
            ],
            max_tokens=300,
            temperature=0.7,
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        error_msg = str(e)
        if "api_key" in error_msg.lower() or "auth" in error_msg.lower() or "incorrect" in error_msg.lower():
            raise HTTPException(
                status_code=503,
                detail="AI service authentication failed. Please check GROQ_API_KEY in .env"
            )
        raise HTTPException(status_code=500, detail=f"Tutor error: {error_msg}")
