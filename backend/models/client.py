from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class GenderEnum(str, enum.Enum):
    M = "M"
    F = "F"

class LanguageEnum(str, enum.Enum):
    NL = "NL"
    FR = "FR"
    EN = "EN"

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    firstname = Column(String(255), nullable=False)
    companyname = Column(String(255), nullable=False)
    address = Column(String(255))
    zip = Column(String(255))
    city = Column(String(255))
    emailaddress = Column(String(255))
    function = Column(String(255))
    phone = Column(String(255))
    mobile = Column(String(255))
    bday = Column(Integer)
    bmonth = Column(Integer)
    byear = Column(Integer)
    gender = Column(Enum(GenderEnum))
    language = Column(Enum(LanguageEnum), default=LanguageEnum.NL)
    advisors_id = Column(Integer, ForeignKey("advisors.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    advisor = relationship("Advisor", back_populates="clients")
    client_tests = relationship("ClientTest", back_populates="client")
