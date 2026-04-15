import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

_client = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("GROK_API_KEY")
        if not api_key:
            raise RuntimeError("GROK_API_KEY not set. Add it to your .env file.")
        _client = OpenAI(base_url="https://api.x.ai/v1", api_key=api_key)
    return _client
