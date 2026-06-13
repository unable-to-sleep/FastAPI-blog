from pydantic import BaseModel
from datetime import datetime

# --- User schemas ---


class UserCreate(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True


# --- Post schemas ---


class PostCreate(BaseModel):
    title: str
    content: str


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True
