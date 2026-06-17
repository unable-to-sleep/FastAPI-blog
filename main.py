from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import engine, get_db, Base
from models import User, Post
from schemas import UserCreate, UserResponse, PostCreate, PostResponse
from werkzeug.security import generate_password_hash, check_password_hash
from auth import create_access_token, get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
import os
import redis
import json

# Base.metadata.create_all(bind=engine)  # handled by Alembic

app = FastAPI()

# conneting to reddis
redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

# CORS configuration

origins = ["http://localhost:5173"]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#


@app.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already taken",
        )

    hashed_password = generate_password_hash(user.password)

    new_user = User(
        username=user.username,
        password=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    db_user = db.query(User).filter(User.username == form_data.username).first()

    if not db_user or not check_password_hash(
        db_user.password,
        form_data.password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    access_token = create_access_token({"sub": str(db_user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
        },
    }


@app.get("/posts", response_model=list[PostResponse])
def get_posts(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    cache_key = f"posts:{skip}:{limit}"

    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    posts = (
        db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    )

    posts_data = [
        {
            "id": p.id,
            "title": p.title,
            "content": p.content,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "user_id": p.user_id,
        }
        for p in posts
    ]
    redis_client.setex(cache_key, 300, json.dumps(posts_data))

    return posts


@app.get("/posts/{post_id}", response_model=PostResponse)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
):
    post = db.get(Post, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    return post


@app.post("/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_post = Post(
        title=post.title,
        content=post.content,
        user_id=current_user.id,
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    # invalidate cache so next GET fetches fresh data
    for key in redis_client.scan_iter("posts:*"):
        redis_client.delete(key)

    return new_post


@app.put("/posts/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.get(Post, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not your post",
        )

    post.title = post_data.title
    post.content = post_data.content

    db.commit()
    db.refresh(post)

    return post


@app.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.get(Post, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not your post",
        )

    db.delete(post)
    db.commit()

    return {"message": "Post deleted successfully"}
