from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix for CTF routes
api_router = APIRouter(prefix="/api")


# ---- Existing demo routes/models ----
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Adding root route directly to app (no prefix)
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.model_dump())
    return status_obj

@app.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# ---- DarkCTF Backend v1 ----
# Puzzles definition (server-authoritative)
PUZZLES = [
    {
        "id": "s1",
        "title": "Stage 1 · Caesar Cipher",
        "difficulty": "Easy",
        "color": "#00FF41",
        "prompt": "Decrypt the text below (classic Caesar). Submit the original phrase to claim the flag.",
        # This payload mirrors the frontend mock for consistency
        "payload": "QHRQ PDWULA",  # Caesar(+3) of "NEON MATRIX"
        "answer": "NEON MATRIX",
        "flag": "Dark_Flag{S1C43s4rCr4ck3d}",
    },
    {
        "id": "s2",
        "title": "Stage 2 · XOR Hex",
        "difficulty": "Medium",
        "color": "#F78166",
        "prompt": "Given a hex string produced by XOR with a single-byte key, recover the original phrase.",
        "payload": None,  # hex varies; keep None here or compute if needed
        "answer": "CYBER NOVA",
        "flag": "Dark_Flag{S2_X0R_wn3d}",
    },
    {
        "id": "s3",
        "title": "Stage 3 · Vigenère",
        "difficulty": "Hard",
        "color": "#FF0040",
        "prompt": "Vigenère cipher with an unknown keyword. Decode and submit the original phrase.",
        "payload": None,
        "answer": "DARK HACKER",
        "flag": "Dark_Flag{S3_V1g3n3r3_OK}",
    },
]
MASTER_FLAG = "Dark_Flag{M4st3r_P0wn3r}"
VALID_STAGES = ["s1", "s2", "s3"]

class SessionProgress(BaseModel):
    solved: Dict[str, bool] = Field(default_factory=lambda: {"s1": False, "s2": False, "s3": False})
    flags: Dict[str, Optional[str]] = Field(default_factory=dict)

class SessionDoc(SessionProgress):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SessionCreateRequest(BaseModel):
    session_id: Optional[str] = None

class SessionResponse(BaseModel):
    session_id: str
    progress: SessionProgress

class SubmitRequest(BaseModel):
    session_id: str
    stage_id: str
    answer: str

class SubmitResponse(BaseModel):
    correct: bool
    message: str
    flag: Optional[str] = None
    progress: SessionProgress
    unlocked_next: Optional[str] = None


async def get_session(session_id: str) -> Optional[Dict[str, Any]]:
    return await db.ctf_sessions.find_one({"_id": session_id})

async def ensure_session(session_id: Optional[str] = None) -> Dict[str, Any]:
    sid = session_id or str(uuid.uuid4())
    doc = await get_session(sid)
    if doc:
        return doc
    new_doc = {
        "_id": sid,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "solved": {"s1": False, "s2": False, "s3": False},
        "flags": {},
        "history": [],
    }
    await db.ctf_sessions.insert_one(new_doc)
    return new_doc

async def update_session(sid: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    updates["updated_at"] = datetime.utcnow()
    await db.ctf_sessions.update_one({"_id": sid}, {"$set": updates})
    return await get_session(sid)

# Moving CTF routes to the /api prefix
@api_router.get("/puzzles")
async def ctf_puzzles():
    # Return metadata and payloads required for challenges
    out = []
    for p in PUZZLES:
        out.append({k: p[k] for k in ["id", "title", "difficulty", "color", "prompt", "payload"]})
    return {"puzzles": out}

@api_router.post("/session", response_model=SessionResponse)
async def ctf_session(req: SessionCreateRequest):
    doc = await ensure_session(req.session_id)
    progress = SessionProgress(solved=doc.get("solved", {}), flags=doc.get("flags", {}))
    return SessionResponse(session_id=doc["_id"], progress=progress)

@api_router.get("/session/{session_id}", response_model=SessionResponse)
async def ctf_session_get(session_id: str):
    doc = await get_session(session_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Session not found")
    progress = SessionProgress(solved=doc.get("solved", {}), flags=doc.get("flags", {}))
    return SessionResponse(session_id=session_id, progress=progress)

@api_router.post("/submit", response_model=SubmitResponse)
async def ctf_submit(req: SubmitRequest):
    doc = await get_session(req.session_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Session not found")
    stage = req.stage_id
    if stage not in VALID_STAGES:
        raise HTTPException(status_code=400, detail="Invalid stage")

    # Enforce unlock order
    order = {"s1": 0, "s2": 1, "s3": 2}
    for s, idx in order.items():
        if idx < order[stage] and not doc["solved"].get(s):
            raise HTTPException(status_code=400, detail="Stage locked. Solve previous stages first.")

    # Check correctness
    expected = next((p for p in PUZZLES if p["id"] == stage), None)
    correct = expected and req.answer.strip().upper() == expected["answer"].upper()

    history_entry = {
        "stage_id": stage,
        "answer": req.answer,
        "correct": bool(correct),
        "ts": datetime.utcnow(),
    }
    doc.setdefault("history", []).append(history_entry)

    if not correct:
        await update_session(req.session_id, {"history": doc["history"]})
        progress = SessionProgress(solved=doc.get("solved", {}), flags=doc.get("flags", {}))
        return SubmitResponse(correct=False, message="Incorrect answer.", progress=progress)

    # Mark solved and set flag
    doc["solved"][stage] = True
    flag = expected["flag"]
    doc["flags"][stage] = flag

    # Master flag if all solved
    unlocked_next = None
    if doc["solved"]["s1"] and doc["solved"]["s2"] and doc["solved"]["s3"]:
        doc["flags"]["master"] = MASTER_FLAG
    else:
        if stage == "s1":
            unlocked_next = "s2"
        elif stage == "s2":
            unlocked_next = "s3"

    await update_session(req.session_id, {"solved": doc["solved"], "flags": doc["flags"], "history": doc["history"]})
    progress = SessionProgress(solved=doc.get("solved", {}), flags=doc.get("flags", {}))
    return SubmitResponse(correct=True, message="Stage cleared.", flag=flag, progress=progress, unlocked_next=unlocked_next)

@api_router.post("/reset")
async def ctf_reset(payload: Dict[str, str]):
    sid = payload.get("session_id")
    if not sid:
        raise HTTPException(status_code=400, detail="session_id required")
    doc = await get_session(sid)
    if not doc:
        raise HTTPException(status_code=404, detail="Session not found")
    updates = {
        "solved": {"s1": False, "s2": False, "s3": False},
        "flags": {},
        "history": [],
    }
    await update_session(sid, updates)
    new_doc = await get_session(sid)
    progress = SessionProgress(solved=new_doc.get("solved", {}), flags=new_doc.get("flags", {}))
    return {"ok": True, "progress": progress}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()