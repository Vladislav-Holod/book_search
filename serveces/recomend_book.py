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
    book = ['Harry Potter']

    result = await search_books(book, prompt)
    return {'prompt': prompt,
            'books': result}
