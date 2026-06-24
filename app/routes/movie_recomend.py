from fastapi import APIRouter

from app.dependencies import ai_client

router = APIRouter(
    prefix='/movie/recommend',
    tags=['AI']
)


@router.post('/', response_model=dict)
async def recommend_movie(prompt: str):
    result = await ai_client.ai_response(prompt)
    topic = {'topic': result}
    return topic
