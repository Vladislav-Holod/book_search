from app.schemas.schemas import Movie
from aiohttp import ClientSession
import asyncio
from loguru import logger
from app.config import config

class ExternelAPIERROR(Exception):
    pass


class PoiskinoProvider:
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def search(self, query: str) -> list[Movie]:
        try:
            async with ClientSession() as session:
                response = await session.get("https://api.poiskkino.dev/v1.4/movie/search",
                                             headers={'X-API-KEY': self.api_key},
                                             params={'page': '1', 'limit': 10, 'query': query})
                data = await response.json()
                list_movie = []
                for i in data['docs']:
                    list_movie.append(Movie(id=0,
                                            id_pois=i['id'],
                                            name_movie=i['alternativeName'],
                                            genres=[g['name'] for g in i['genres']],year=i['year'],
                                            description=i['description'],
                                            poster_image=i['poster']['previewUrl'],
                                            movieLength=i['movieLength'],
                                            rating=i['rating']['kp']
                                            ))
                return list_movie
        except Exception as e:
            logger.error(f'Ошибка AI - {e}')
            raise ExternelAPIERROR('Ошибка обращение к апи')

