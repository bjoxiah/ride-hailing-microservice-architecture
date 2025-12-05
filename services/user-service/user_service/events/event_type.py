from enum import Enum

class EventType(str, Enum):
    user_created = "user.created"
    user_updated = "user.updated"
