import json
from typing import Any

from app.services.providers_llm.base import LLMProvider
from loguru import logger
from fastapi import HTTPException,status

class AIService:
    def __init__(self, provider: LLMProvider):
        self.provider = provider

    async def ai_response(self, text: str) -> Any:
        prompt = f"""
        Определи основную тему запроса пользователя для поиска фильмов.

        Важно: результат будет использоваться для поиска фильмов в базе данных / API, поэтому тема должна быть максимально конкретной и пригодной для поиска кино.

        Верни ТОЛЬКО JSON.

        Формат ответа:
        - topic: строка

        Правила:
        - topic должен описывать основную кинематографическую тему или жанр
        - используй короткие формулировки (1–4 слова)
        - не добавляй пояснений
        - не добавляй текст кроме JSON
        - не пиши "фильм", "кино" в topic (если это не жанр)
        - ориентируйся на смысл запроса пользователя

        Примеры:
        - "фильмы про мафию" → "mafia crime"
        - "романтические комедии" → "romantic comedy"
        - "фильмы про космос" → "space exploration"
        - "ужасы в доме" → "haunted house horror"
        - "фильмы про тюрьму" → "prison drama"

        Запрос пользователя:
        {text}
        """
        result = await self.provider.generate(prompt)
        try:
            data = json.loads(result)
            return data['topic']
        except Exception as e:
            logger.info(f'Ошибка Парсинга json - {e}')
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                                detail='Проблема парсинга в слое ai_service ')
