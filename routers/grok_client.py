import os
from openai import OpenAI
from dotenv import load_dotenv

# Force reload .env every time this module is accessed
load_dotenv(override=True)

_client = None
_current_key = None

# Model to use across all routers (Groq-hosted)
GROQ_MODEL = "llama-3.3-70b-versatile"


def get_client() -> OpenAI:
    """
    Return a singleton OpenAI client pointed at the Groq API.

    If the API key changes in the environment (e.g. after a hot-reload),
    the client is recreated automatically.
    """
    global _client, _current_key

    # Re-read .env to pick up changes without restart
    load_dotenv(override=True)

    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key or api_key in ("YOUR_GROQ_API_KEY_HERE", "PASTE_YOUR_REAL_GROQ_KEY_HERE"):
        raise RuntimeError(
            "GROQ_API_KEY not set. "
            "Get one from https://console.groq.com/keys and add it to your .env file."
        )

    # Recreate if first time or if the key has changed
    if _client is None or _current_key != api_key:
        _client = OpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=api_key,
        )
        _current_key = api_key

    return _client


def reset_client():
    """Force-reset the singleton (useful after key rotation)."""
    global _client, _current_key
    _client = None
    _current_key = None
