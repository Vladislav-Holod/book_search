from app.serveces.external_api import gemini_response

async def search_books(query: list[str],
                       prompt: str) -> list[dict]:
    books_result = []
    for i in query:
        books_result.append({
            'prompt': prompt,
            'name_book': 'Harry Potter',
            'genre': 'fantasy',
            'image': 'https://tiendil.org/ru/posts/about-book-harry-potter'
        })
    return books_result


async def recommend_book(prompt: str) -> dict:
    """
    Функция для запроса в gemeni для определния тематики далее ищет через
    OpenLibrary книги и отдает словарь по pydantic модели
    """
    topic = await gemini_response(prompt)
    return topic



