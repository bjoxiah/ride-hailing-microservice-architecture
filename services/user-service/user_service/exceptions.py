from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY, HTTP_500_INTERNAL_SERVER_ERROR

def format_error(message, code, details=None):
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "details": details
        }
    }

# Handles Pydantic model validation errors
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=HTTP_422_UNPROCESSABLE_ENTITY,
        content=format_error(
            "Validation Error",
            422,
            exc.errors()
        ),
    )

# Handles your own raises: HTTPException(status_code=..., detail=...)
async def http_exception_handler(request: Request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=format_error(
            exc.detail,
            exc.status_code
        ),
    )

# Catches ANY unhandled exception (your global catch-all)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR,
        content=format_error(
            "Internal Server Error",
            500,
            str(exc)
        )
    )
