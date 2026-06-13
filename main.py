from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, get_db, Base
from models import User, Post
from schemas import UserCreate, UserResponse, PostCreate, PostResponse
from werkzeug.security import generate_password_hash, check_password_hash
from auth import create_access_token, get_current_user
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed = generate_password_hash(user.password)
    new_user = User(username=user.username, password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.username == form_data.username).first()
    if not db_user or not check_password_hash(db_user.password, form_data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(db_user.id)})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/posts", response_model=list[PostResponse])
def get_posts(db: Session = Depends(get_db)):
    return db.query(Post).order_by(Post.created_at.desc()).all()


@app.get("/posts/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


from models import User as UserModel


@app.post("/posts", response_model=PostResponse)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    new_post = Post(title=post.title, content=post.content, user_id=current_user.id)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post


@app.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your post")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}
