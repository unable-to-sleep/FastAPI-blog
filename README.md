# FastAPI Blog API

A simple blog REST API built with FastAPI, PostgreSQL, and JWT authentication. This repository contains a FastAPI backend and a React + Vite frontend.

Languages: JavaScript, Python, CSS, Mako, HTML, Shell

## Features
- User registration and login
- JWT-protected routes
- Create, read, delete posts
- Auto-generated API docs (Swagger / ReDoc)

## Tech stack
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- JWT (python-jose)
- React + Vite (frontend)

## Prerequisites
- Python 3.9+ (or the version used in the project)
- Node.js 16+ / npm or yarn (for the frontend)
- PostgreSQL

## Setup (backend)
1. Clone the repository
   git clone https://github.com/unable-to-sleep/FastAPI-blog.git
   cd FastAPI-blog
2. Create and activate a Python virtual environment
   python -m venv .venv
   source .venv/bin/activate  # macOS / Linux
   .\.venv\Scripts\activate  # Windows (PowerShell)
3. Install Python dependencies
   pip install -r requirements.txt
4. Create a `.env` file in the project root with at least the following variables:
   DATABASE_URL=postgresql://user:password@localhost:5432/blog_db
   SECRET_KEY=yoursecretkey
   # Optionally add any other env variables your project expects
5. Apply database migrations (if your project uses migrations)
   # If using Alembic, run something like:
   alembic upgrade head
6. Run the backend
   uvicorn main:app --reload

The API will be available at http://localhost:8000

## Frontend (development)
1. Change into the frontend directory
   cd frontend
2. Install dependencies
   npm install
   # or
   yarn
3. Run the dev server
   npm run dev

The frontend dev server (Vite) typically runs at http://localhost:5173 — check the terminal output.

## API docs
FastAPI provides interactive API docs by default:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
