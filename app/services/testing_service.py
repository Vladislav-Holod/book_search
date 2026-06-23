import asyncio
import aiohttp
import pprint


async def main():
    async with aiohttp.ClientSession() as session:
        response = await session.get(
            "https://api.poiskkino.dev/v1.4/movie/search",
            headers={
                "X-API-KEY": "A9NA320-19A4RV6-G5HZ0RY-FA6ANXP"
            },
            params={
                "page": "1",
                "limit": 10,
                "query":"Harry poter"
            }
        )

        data = await response.json()
        for i in data['docs']:
            print('------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------')
            pprint.pprint(i)


asyncio.run(main())
