from app.schemas.schemas import Movie
from aiohttp import ClientSession
import asyncio
from loguru import logger
from app.config import config

_default_movie_poster ='https://img.magnific.com/premium-vector/black-blank-book-cover-isolated-transparent_168129-46.jpg?semt=ais_hybrid&w=740'

class ExternelAPIERROR(Exception):
    pass


class PoiskinoProvider:
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def search(self, query: dict) -> list[Movie]:
        try:
            async with ClientSession() as session:
                response = await session.get("https://api.poiskkino.dev/v1.4/movie/search",
                                             headers={'X-API-KEY': self.api_key},
                                             params={'page': '1', 'limit': 10, 'query': query})
                data = await response.json()
                list_movie = []
                for i in data['docs']:
                    list_movie.append(Movie(
                        id=0,
                        id_pois=i.get('id'),
                        name_movie=i.get('alternativeName') or i.get('name') or 'Без имени',
                        genres=[g['name'] for g in (i.get('genres') or [])],
                        year=i.get('year'),
                        description=i.get('description'),
                        poster_image=(i.get('poster') or {}).get('previewUrl') or _default_movie_poster,
                        movieLength=i.get('movieLength'),
                        rating=(i.get('rating') or {}).get('kp')
                    ))
                return list_movie
        except Exception as e:
            logger.error(f'Ошибка AI - {e}')
            raise ExternelAPIERROR('Ошибка обращение к апи')

