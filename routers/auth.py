import base64
import hashlib

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from routers.store import users

router = APIRouter()


class AuthRequest(BaseModel):
    username: str
    password: str


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def _make_token(username: str) -> str:
    return base64.b64encode(username.encode()).decode()


@router.post("/auth/register")
def register(req: AuthRequest):
    if req.username in users:
        raise HTTPException(status_code=409, detail="Username already exists")
    users[req.username] = _hash_password(req.password)
    return {"success": True, "token": _make_token(req.username)}


@router.post("/auth/login")
def login(req: AuthRequest):
    stored_hash = users.get(req.username)
    if stored_hash is None or stored_hash != _hash_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"success": True, "token": _make_token(req.username)}
