import asyncio
from functools import wraps
from opentelemetry import trace

tracer = trace.get_tracer("user-service")

def traced(name: str):
    def decorator(func):
        if asyncio.iscoroutinefunction(func):
            @wraps(func)
            async def async_wrapper(*args, **kwargs):
                with tracer.start_as_current_span(name):
                    return await func(*args, **kwargs)
            return async_wrapper
        else:
            @wraps(func)
            def sync_wrapper(*args, **kwargs):
                with tracer.start_as_current_span(name):
                    return func(*args, **kwargs)
            return sync_wrapper
    return decorator
