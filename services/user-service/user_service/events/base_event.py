import uuid
from datetime import datetime, timezone
from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")

class BaseEvent(BaseModel, Generic[T]):
    event_id: uuid.UUID = uuid.uuid4()
    event_type: str
    occurred_at: datetime = datetime.now(timezone.utc)
    source_service: str = "user-service"
    correlation_id: Optional[uuid.UUID] = None
    data: T
