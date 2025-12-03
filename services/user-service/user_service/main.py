from fastapi import FastAPI, HTTPException, Response
from contextlib import asynccontextmanager

from fastapi.exceptions import RequestValidationError
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

from user_service.kafka import kafka
from user_service.db import init_db
from user_service.tracing import configure_tracing
from user_service.routes.users import router
from user_service.exceptions import (
    validation_exception_handler,
    http_exception_handler,
    global_exception_handler
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_tracing()
    init_db()
    await kafka.start()
    yield
    await kafka.stop()

app = FastAPI(lifespan=lifespan)
FastAPIInstrumentor.instrument_app(app)

# Global handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

app.include_router(router)

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

def run():
    import uvicorn
    uvicorn.run("user_service.main:app", host="0.0.0.0", port=8002, reload=True)
