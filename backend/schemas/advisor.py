from pydantic import BaseModel, EmailStr
from typing import Optional

class AdvisorBase(BaseModel):
    name: str
    emailaddress: EmailStr

class AdvisorCreate(AdvisorBase):
    pass

class AdvisorUpdate(AdvisorBase):
    name: Optional[str] = None
    emailaddress: Optional[EmailStr] = None

class AdvisorResponse(AdvisorBase):
    id: int

    class Config:
        from_attributes = True
