import json
import re

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from routers.grok_client import get_client

router = APIRouter()


class CodeEvaluateRequest(BaseModel):
    code: str
    task: str


def _clean_json(text: str) -> str:
    """Strip markdown code fences if Grok wraps the JSON."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


@router.post("/code/evaluate")
def code_evaluate(req: CodeEvaluateRequest):
    try:
        response = get_client().chat.completions.create(
            model="grok-3",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an ML code reviewer. Evaluate the code for the "
                        "given task. Return ONLY valid JSON with no markdown: "
                        '{"score": <integer 1-10>, "feedback": "<string>", '
                        '"fix": "<string>"}.'
                    ),
                },
                {
                    "role": "user",
                    "content": f"Task: {req.task}\n\nCode:\n{req.code}",
                },
            ],
            max_tokens=400,
            temperature=0.3,
        )
        raw = response.choices[0].message.content
        result = json.loads(_clean_json(raw))
        return result
    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Grok returned invalid JSON. Retry.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
