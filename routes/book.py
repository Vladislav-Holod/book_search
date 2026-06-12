from fastapi import APIRouter

from serveces.schemas import (BookPrompt,
                              Book,
                              RecommendResponse)
from serveces.recomend_book import recommend_book

router = APIRouter(
    prefix='/books',
    tags=['books']
)


@router.post('/recommend', response_model= RecommendResponse)
async def get_book_recommend(prompt: BookPrompt):
    return await recommend_book(prompt.prompt)
