from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from pathlib import Path
from datetime import datetime
import json
import os

app = FastAPI(title="ClientFlow API")

FRONTEND_URL = os.getenv("FRONTEND_URL", "")
LOCAL_FRONTENDS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

allowed_origins = [origin for origin in LOCAL_FRONTENDS if origin]
if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

CONTACTS_FILE = DATA_DIR / "contacts.json"

if not CONTACTS_FILE.exists():
    CONTACTS_FILE.write_text("[]", encoding="utf-8")


class ContactCreate(BaseModel):
    name: str
    business_name: Optional[str] = ""
    phone: str
    email: Optional[str] = ""
    service_interest: Optional[str] = ""
    message: Optional[str] = ""


class ContactOut(BaseModel):
    id: str
    created_at: str
    name: str
    business_name: Optional[str] = ""
    phone: str
    email: Optional[str] = ""
    service_interest: Optional[str] = ""
    message: Optional[str] = ""


def load_contacts() -> List[dict]:
    try:
        raw = CONTACTS_FILE.read_text(encoding="utf-8").strip()
        if not raw:
            return []
        return json.loads(raw)
    except json.JSONDecodeError:
        return []


def save_contacts(contacts: List[dict]) -> None:
    CONTACTS_FILE.write_text(
        json.dumps(contacts, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


@app.get("/")
def root():
    return {
        "message": "ClientFlow backend attivo",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/contacts", response_model=List[ContactOut])
def get_contacts():
    contacts = load_contacts()
    contacts_sorted = sorted(
        contacts,
        key=lambda x: x.get("created_at", ""),
        reverse=True,
    )
    return contacts_sorted


@app.post("/contacts", response_model=ContactOut)
def create_contact(contact: ContactCreate):
    if not contact.name.strip():
        raise HTTPException(status_code=400, detail="Il nome è obbligatorio.")
    if not contact.phone.strip():
        raise HTTPException(status_code=400, detail="Il telefono è obbligatorio.")

    contacts = load_contacts()

    new_contact = {
        "id": str(int(datetime.utcnow().timestamp() * 1000)),
        "created_at": datetime.utcnow().isoformat(),
        "name": contact.name.strip(),
        "business_name": (contact.business_name or "").strip(),
        "phone": contact.phone.strip(),
        "email": (contact.email or "").strip(),
        "service_interest": (contact.service_interest or "").strip(),
        "message": (contact.message or "").strip(),
    }

    contacts.append(new_contact)
    save_contacts(contacts)

    return new_contact