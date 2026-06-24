from app.services.ai_service import AIService
from app.services.providers_llm.gemeni_provider import GeminiProvider
from app.services.externel_api.poiskino import PoiskinoProvider
from app.config import config

ai_client = AIService(GeminiProvider())
api_kinopoisk = PoiskinoProvider(api_key=config.API_POISKINO_KEY)
