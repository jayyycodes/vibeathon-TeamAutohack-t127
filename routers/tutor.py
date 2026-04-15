from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from routers.grok_client import get_client

router = APIRouter()


class TutorRequest(BaseModel):
    topic: str
    question: str


@router.post("/tutor")
def tutor_ask(req: TutorRequest):
    try:
        response = get_client().chat.completions.create(
            model="grok-3",
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
        raise HTTPException(status_code=500, detail=str(e))
