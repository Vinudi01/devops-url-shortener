import secrets
import string

from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse

from app.database import get_connection
from app.models import URLCreate


app = FastAPI(title="DevOps URL Shortener")


def generate_short_code(length: int = 6):
    characters = string.ascii_letters + string.digits
    return "".join(secrets.choice(characters) for _ in range(length))


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/db-health")
def db_health():
    connection = get_connection()

    try:
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        cursor.close()

        return {
            "status": "ok",
            "database": result[0],
        }

    finally:
        connection.close()


@app.get("/")
def root():
    return {
        "message": "DevOps URL Shortener API",
        "version": "1.0.0",
    }


@app.post("/shorten")
def shorten_url(data: URLCreate):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        while True:
            short_code = generate_short_code()

            cursor.execute(
                "SELECT id FROM urls WHERE short_code = %s",
                (short_code,),
            )

            if cursor.fetchone() is None:
                break

        cursor.execute(
            """
            INSERT INTO urls (short_code, original_url)
            VALUES (%s, %s)
            RETURNING short_code, original_url
            """,
            (short_code, str(data.url)),
        )

        result = cursor.fetchone()

        connection.commit()
        cursor.close()

        return {
            "short_code": result[0],
            "original_url": result[1],
        }

    finally:
        connection.close()


@app.get("/{short_code}")
def redirect_url(short_code: str):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT original_url
            FROM urls
            WHERE short_code = %s
            """,
            (short_code,),
        )

        result = cursor.fetchone()

        cursor.close()

        if result is None:
            raise HTTPException(
                status_code=404,
                detail="Short URL not found",
            )

        return RedirectResponse(
            url=result[0],
            status_code=307,
        )

    finally:
        connection.close()