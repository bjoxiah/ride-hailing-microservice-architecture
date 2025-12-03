import os

class Settings:
    POSTGRES_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgresuser:postgrespwd@postgres-user-service:5432/userdb"
    )
    KAFKA_BROKER: str = os.getenv("KAFKA_BROKER", "redpanda:9092")

settings = Settings()
