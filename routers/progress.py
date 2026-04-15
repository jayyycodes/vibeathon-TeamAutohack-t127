from fastapi import APIRouter
from pydantic import BaseModel

from routers.store import progress

router = APIRouter()


class ProgressUpdateRequest(BaseModel):
    username: str
    module_id: int
    score: int


def _empty_progress() -> dict:
    return {"completed": [], "scores": {}, "total_score": 0}


@router.post("/progress/update")
def update_progress(req: ProgressUpdateRequest):
    if req.username not in progress:
        progress[req.username] = _empty_progress()

    user = progress[req.username]

    # Update score for this module
    user["scores"][str(req.module_id)] = req.score

    # Mark module as completed if not already
    if req.module_id not in user["completed"]:
        user["completed"].append(req.module_id)

    # Recalculate total
    user["total_score"] = sum(user["scores"].values())

    return {"updated": True, "total_score": user["total_score"]}


@router.get("/progress/{username}")
def get_progress(username: str):
    return progress.get(username, _empty_progress())
