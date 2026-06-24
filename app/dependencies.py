from app.services.ai_service import AIService
from app.services.providers_llm.gemeni_provider import GeminiProvider

ai_client = AIService(GeminiProvider())