from fastapi import FastAPI, APIRouter, HTTPException, status
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, constr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from seed_data import PROJECTS_SEED, POSTS_SEED

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Daniel Mercer Portfolio API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class Project(BaseModel):
    id: str
    title: str
    category: str
    year: int
    description: str
    tech: List[str]
    image: str
    link: str = "#"
    featured: bool = False
    order: int = 0


class Post(BaseModel):
    id: str
    title: str
    excerpt: str
    date: str
    readTime: str = Field(alias="readTime")
    tag: str
    cover: str
    body: Optional[List[str]] = None

    class Config:
        populate_by_name = True


class ContactMessageCreate(BaseModel):
    name: constr(min_length=2, max_length=100)
    email: EmailStr
    budget: Optional[str] = None
    message: constr(min_length=10, max_length=4000)


class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    budget: Optional[str] = None
    message: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


# ---------- Helpers ----------
def _serialize_post(doc: dict) -> dict:
    # Map read_time (stored) -> readTime (response)
    return {
        "id": doc["id"],
        "title": doc["title"],
        "excerpt": doc["excerpt"],
        "date": doc["date"],
        "readTime": doc.get("read_time", doc.get("readTime", "")),
        "tag": doc["tag"],
        "cover": doc["cover"],
        "body": doc.get("body", []),
    }


def _serialize_project(doc: dict) -> dict:
    return {
        "id": doc["id"],
        "title": doc["title"],
        "category": doc["category"],
        "year": doc["year"],
        "description": doc["description"],
        "tech": doc["tech"],
        "image": doc["image"],
        "link": doc.get("link", "#"),
        "featured": doc.get("featured", False),
        "order": doc.get("order", 0),
    }


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Portfolio API up"}


@api_router.get("/projects", response_model=List[Project])
async def list_projects():
    cursor = db.projects.find().sort([("order", 1), ("year", -1)])
    docs = await cursor.to_list(length=100)
    return [_serialize_project(d) for d in docs]


@api_router.get("/posts")
async def list_posts():
    cursor = db.posts.find().sort("created_at", -1)
    docs = await cursor.to_list(length=100)
    return [_serialize_post(d) for d in docs]


@api_router.get("/posts/{post_id}")
async def get_post(post_id: str):
    doc = await db.posts.find_one({"id": post_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    return _serialize_post(doc)


@api_router.post("/contact", status_code=status.HTTP_201_CREATED)
async def create_contact_message(payload: ContactMessageCreate):
    msg = ContactMessage(**payload.model_dump())
    doc = jsonable_encoder(msg)
    await db.contact_messages.insert_one(doc)
    return {"id": msg.id, "ok": True}


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact_messages():
    # Simple admin-style listing; no auth for MVP.
    cursor = db.contact_messages.find().sort("created_at", -1)
    docs = await cursor.to_list(length=500)
    return [ContactMessage(**d) for d in docs]


# Legacy status endpoints (keep for compatibility)
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    await db.status_checks.insert_one(jsonable_encoder(status_obj))
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    docs = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**d) for d in docs]


# ---------- App wiring ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def seed_db():
    # Seed projects if empty
    if await db.projects.count_documents({}) == 0:
        await db.projects.insert_many([dict(p) for p in PROJECTS_SEED])
        logger.info("Seeded %d projects", len(PROJECTS_SEED))
    # Seed posts if empty
    if await db.posts.count_documents({}) == 0:
        now = datetime.now(timezone.utc)
        docs = []
        for i, p in enumerate(POSTS_SEED):
            doc = dict(p)
            # created_at in reverse order so first in list is newest
            doc["created_at"] = now.isoformat()
            doc["_order"] = i
            docs.append(doc)
        await db.posts.insert_many(docs)
        logger.info("Seeded %d posts", len(POSTS_SEED))


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
