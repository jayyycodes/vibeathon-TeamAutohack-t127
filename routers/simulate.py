import json
import re

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from routers.grok_client import get_client, GROQ_MODEL

router = APIRouter()


class SpamRequest(BaseModel):
    text: str


def _clean_json(text: str) -> str:
    """Strip markdown code fences if the LLM wraps the JSON."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


@router.post("/simulate/spam")
def simulate_spam(req: SpamRequest):
    try:
        client = get_client()
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a spam classifier. Classify the given text. "
                        "Return ONLY valid JSON with no markdown: "
                        '{"is_spam": <bool>, "confidence": <float 0-1>, "reason": "<string>"}.'
                    ),
                },
                {
                    "role": "user",
                    "content": req.text,
                },
            ],
            max_tokens=150,
            temperature=0.3,
        )
        raw = response.choices[0].message.content
        result = json.loads(_clean_json(raw))
        return result
    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="AI returned invalid JSON. Please retry.")
    except Exception as e:
        error_msg = str(e)
        if "api_key" in error_msg.lower() or "auth" in error_msg.lower() or "incorrect" in error_msg.lower():
            raise HTTPException(
                status_code=503,
                detail="AI service authentication failed. Please check GROQ_API_KEY in .env"
            )
        raise HTTPException(status_code=500, detail=f"Simulation error: {error_msg}")
