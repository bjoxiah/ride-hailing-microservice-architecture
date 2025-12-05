from datetime import datetime, timezone
import uuid
from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlmodel import Session, select
from user_service.db import get_session
from user_service.models.user import User, UserCreate, UserUpdate
from user_service.kafka import kafka
from user_service.utils.decorator import traced
from user_service.utils.responses import success
from user_service.events.base_event import BaseEvent
from user_service.events.event_type import EventType


router = APIRouter()

@router.post("/users")
@traced("create_user")
async def create_user(user: UserCreate, session: Session = Depends(get_session)):
    # db_user = User.from_orm(user)
    db_user = User(**user.model_dump())
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    event_payload = BaseEvent(
        event_type=EventType.user_created.value,
        data=db_user,
        correlation_id=uuid.uuid4()
    )

    await kafka.publish(EventType.user_created.value, jsonable_encoder(event_payload))
    return success({"user": db_user})


@router.put("/users/{user_id}")
@traced("update_user")
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    session: Session = Depends(get_session)
):
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(db_user, field, value)
    
    db_user.updated_at = datetime.now(timezone.utc)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    event_payload = BaseEvent(
        event_type=EventType.user_updated.value,
        data=db_user,
        correlation_id=uuid.uuid4()
    )

    await kafka.publish(EventType.user_updated.value, jsonable_encoder(event_payload))
    return success({"user": db_user})


@router.get("/users/{user_id}")
@traced("get_user_by_id")
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    return success({"user": user})


@router.get("/users/by-email/{email}")
@traced("get_user_by_email")
def get_user_by_email_endpoint(email: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")    
    return success({"user": user})
