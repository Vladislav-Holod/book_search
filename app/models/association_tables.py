from sqlalchemy import Table, Column, ForeignKey
from app.database import Base

user_profile_liked_movie = Table(
    "user_profile_liked_movie",
    Base.metadata,
    Column("profile_id", ForeignKey("user_profiles.id"), primary_key=True),
    Column("movie_base_id", ForeignKey("movie_base.id"), primary_key=True),
)