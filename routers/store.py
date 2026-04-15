"""
Centralized in-memory data store.

All routers import shared state from here instead of defining their own
module-level dicts.  This keeps cross-router access clean and avoids
circular imports.
"""

# {username: hashed_password}
users: dict = {}

# {username: {"completed": [module_id, ...], "scores": {module_id: score}, "total_score": int}}
progress: dict = {}
