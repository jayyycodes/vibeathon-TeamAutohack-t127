import json
import re
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from routers.grok_client import get_client, GROQ_MODEL

router = APIRouter()


class QuizGenerateRequest(BaseModel):
    topic: str
    difficulty: Literal["easy", "medium", "hard"]


class QuizEvaluateRequest(BaseModel):
    question: str
    user_answer: str
    correct_answer: str


def _clean_json(text: str) -> str:
    """Strip markdown code fences if the LLM wraps the JSON."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


@router.post("/quiz/generate")
def quiz_generate(req: QuizGenerateRequest):
    try:
        client = get_client()
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a quiz generator. Return ONLY a valid JSON array "
                        "with exactly 5 MCQ objects. No markdown, no explanation, "
                        "no code fences. Each object must have: "
                        '"question" (string), "options" (array of 4 strings like '
                        '"A: ...", "B: ..."), "correct" (one of "A","B","C","D"), '
                        '"explanation" (string).'
                    ),
                },
                {
                    "role": "user",
                    "content": f"Generate 5 {req.difficulty} MCQs on: {req.topic}",
                },
            ],
            max_tokens=1500,
            temperature=0.5,
        )
        raw = response.choices[0].message.content
        quiz = json.loads(_clean_json(raw))
        if not isinstance(quiz, list) or len(quiz) != 5:
            raise ValueError("Expected exactly 5 quiz items")
        return {"quiz": quiz}
    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="AI returned invalid JSON. Please retry.")
    except Exception as e:
        error_msg = str(e)
        if "api_key" in error_msg.lower() or "auth" in error_msg.lower() or "incorrect" in error_msg.lower():
            raise HTTPException(
                status_code=503,
                detail="AI service authentication failed. Please check GROQ_API_KEY in .env"
            )
        raise HTTPException(status_code=500, detail=f"Quiz generation error: {error_msg}")


@router.post("/quiz/evaluate")
def quiz_evaluate(req: QuizEvaluateRequest):
    try:
        is_correct = req.user_answer.strip().upper() == req.correct_answer.strip().upper()
        client = get_client()
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a quiz evaluator. Given a question, the user's "
                        "answer, and the correct answer, provide a brief 1-2 "
                        "sentence explanation of why the correct answer is right."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Question: {req.question}\n"
                        f"User Answer: {req.user_answer}\n"
                        f"Correct Answer: {req.correct_answer}"
                    ),
                },
            ],
            max_tokens=200,
            temperature=0.3,
        )
        return {
            "is_correct": is_correct,
            "explanation": response.choices[0].message.content,
        }
    except Exception as e:
        error_msg = str(e)
        if "api_key" in error_msg.lower() or "auth" in error_msg.lower() or "incorrect" in error_msg.lower():
            raise HTTPException(
                status_code=503,
                detail="AI service authentication failed. Please check GROQ_API_KEY in .env"
            )
        raise HTTPException(status_code=500, detail=f"Quiz evaluation error: {error_msg}")
