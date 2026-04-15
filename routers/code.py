import json
import re

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from routers.grok_client import get_client, GROQ_MODEL

router = APIRouter()


class CodeEvaluateRequest(BaseModel):
    code: str
    task: str


def _clean_json(text: str) -> str:
    """Strip markdown code fences if the LLM wraps the JSON."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


@router.post("/code/evaluate")
def code_evaluate(req: CodeEvaluateRequest):
    try:
        client = get_client()
        response = client.chat.completions.create(
            model=GROQ_MODEL,
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
        raise HTTPException(status_code=422, detail="AI returned invalid JSON. Please retry.")
    except Exception as e:
        error_msg = str(e)
        if "api_key" in error_msg.lower() or "auth" in error_msg.lower() or "incorrect" in error_msg.lower():
            raise HTTPException(
                status_code=503,
                detail="AI service authentication failed. Please check GROQ_API_KEY in .env"
            )
        raise HTTPException(status_code=500, detail=f"Code evaluation error: {error_msg}")


class CodeRunRequest(BaseModel):
    code: str
    language: str = "python"


@router.post("/code/run")
def code_run(req: CodeRunRequest):
    try:
        client = get_client()
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a code execution simulator. Given the code and its "
                        "language, predict the output and explain what the code does. "
                        "Return ONLY valid JSON with no markdown: "
                        '{"output": "<simulated stdout>", "explanation": "<string>"}.'
                    ),
                },
                {
                    "role": "user",
                    "content": f"Language: {req.language}\n\nCode:\n{req.code}",
                },
            ],
            max_tokens=200,
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
        raise HTTPException(status_code=500, detail=f"Code run error: {error_msg}")
