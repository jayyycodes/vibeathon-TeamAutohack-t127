import json
import re
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from routers.grok_client import get_client

router = APIRouter()


class QuizGenerateRequest(BaseModel):
    topic: str
    difficulty: Literal["easy", "medium", "hard"]


class QuizEvaluateRequest(BaseModel):
    question: str
    user_answer: str
    correct_answer: str


def _clean_json(text: str) -> str:
    """Strip markdown code fences if Grok wraps the JSON."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


@router.post("/quiz/generate")
def quiz_generate(req: QuizGenerateRequest):
    try:
        response = get_client().chat.completions.create(
            model="grok-3",
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
        raise HTTPException(status_code=422, detail="Grok returned invalid JSON. Retry.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/quiz/evaluate")
def quiz_evaluate(req: QuizEvaluateRequest):
    try:
        is_correct = req.user_answer.strip().upper() == req.correct_answer.strip().upper()
        response = get_client().chat.completions.create(
            model="grok-3",
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
        raise HTTPException(status_code=500, detail=str(e))
