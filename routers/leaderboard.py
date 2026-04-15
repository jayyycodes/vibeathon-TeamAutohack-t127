from fastapi import APIRouter

from routers.store import progress

router = APIRouter()


@router.get("/leaderboard")
def leaderboard():
    sorted_users = sorted(
        progress.items(),
        key=lambda item: item[1].get("total_score", 0),
        reverse=True,
    )[:10]

    return [
        {
            "rank": idx + 1,
            "username": username,
            "total_score": data.get("total_score", 0),
            "completed_count": len(data.get("completed", [])),
        }
        for idx, (username, data) in enumerate(sorted_users)
    ]
