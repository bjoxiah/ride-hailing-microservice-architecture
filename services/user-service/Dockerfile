FROM python:3.11-slim

WORKDIR /app

# Install build dependencies and Poetry
RUN apt-get update && apt-get install -y gcc libpq-dev curl && rm -rf /var/lib/apt/lists/*
RUN pip install poetry

# # Copy pyproject files first for caching
# COPY pyproject.toml poetry.lock* ./

# Copy the rest of the code
COPY . .

# Install dependencies (including the package itself)
RUN poetry install

EXPOSE 8002

# Run FastAPI with uvicorn
CMD ["poetry", "run", "serve"]
