from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ContactCreate(BaseModel):
    name: str
    business_name: Optional[str] = None
    phone: str
    email: Optional[str] = None
    service_interest: Optional[str] = None
    message: Optional[str] = None


class ContactResponse(BaseModel):
    id: int
    name: str
    business_name: Optional[str] = None
    phone: str
    email: Optional[str] = None
    service_interest: Optional[str] = None
    message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True