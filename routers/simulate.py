import json
import re

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from routers.grok_client import get_client

router = APIRouter()


class SpamRequest(BaseModel):
    text: str


def _clean_json(text: str) -> str:
    """Strip markdown code fences if Grok wraps the JSON."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


@router.post("/simulate/spam")
def simulate_spam(req: SpamRequest):
    try:
        response = get_client().chat.completions.create(
            model="grok-3",
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
        raise HTTPException(status_code=422, detail="Grok returned invalid JSON. Retry.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
