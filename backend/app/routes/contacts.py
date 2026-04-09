from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter()


@router.post("/", response_model=ContactResponse)
def create_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    new_contact = Contact(
        name=payload.name,
        business_name=payload.business_name,
        phone=payload.phone,
        email=payload.email,
        service_interest=payload.service_interest,
        message=payload.message,
    )

    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact


@router.get("/", response_model=list[ContactResponse])
def list_contacts(db: Session = Depends(get_db)):
    return db.query(Contact).order_by(Contact.created_at.desc()).all()