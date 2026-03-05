from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class GenderEnum(str, Enum):
    M = "M"
    F = "F"

class LanguageEnum(str, Enum):
    NL = "NL"
    FR = "FR"
    EN = "EN"

class ClientBase(BaseModel):
    name: str
    firstname: str
    companyname: str
    address: Optional[str] = None
    zip: Optional[str] = None
    city: Optional[str] = None
    emailaddress: Optional[EmailStr] = None
    function: Optional[str] = None
    phone: Optional[str] = None
    mobile: Optional[str] = None
    bday: Optional[int] = None
    bmonth: Optional[int] = None
    byear: Optional[int] = None
    gender: Optional[GenderEnum] = None
    language: LanguageEnum = LanguageEnum.NL
    advisors_id: int

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    name: Optional[str] = None
    firstname: Optional[str] = None
    companyname: Optional[str] = None
    advisors_id: Optional[int] = None

class ClientResponse(ClientBase):
    id: int

    class Config:
        from_attributes = True
