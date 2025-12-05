from enum import Enum
import re
import uuid
from typing_extensions import Annotated
from pydantic import EmailStr, constr, field_validator
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone

# Database model
class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    email: str = Field(sa_column_kwargs={"unique": True})
    phone_number: Optional[str] = None
    role: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserRole(str, Enum):
    rider = "rider"
    driver = "driver"
    
# Schema for creating a user (what clients send)
class UserCreate(SQLModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    role: UserRole
    phone_number:  Optional[str] = None
    
    @field_validator("phone_number")
    def validate_phone_number(cls, value):
        if value is None:
            return value
        import re
        if not re.match(r"^[+\d]+$", value):
            raise ValueError("Phone number must contain only digits and optional '+'.")
        return value

    
# Schema for updating a user (partial updates allowed)
class UserUpdate(SQLModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    phone_number: Optional[str] = None

