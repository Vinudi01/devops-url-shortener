import os

import psycopg2


DATABASE_HOST = os.getenv("DATABASE_HOST", "localhost")
DATABASE_PORT = os.getenv("DATABASE_PORT", "5432")
DATABASE_NAME = os.getenv("POSTGRES_DB", "urlshortener")
DATABASE_USER = os.getenv("POSTGRES_USER", "urluser")
DATABASE_PASSWORD = os.getenv("POSTGRES_PASSWORD", "urlpassword")


def get_connection():
    return psycopg2.connect(
        host=DATABASE_HOST,
        port=DATABASE_PORT,
        database=DATABASE_NAME,
        user=DATABASE_USER,
        password=DATABASE_PASSWORD,
    )
