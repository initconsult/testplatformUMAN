from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Advisor(Base):
    __tablename__ = "advisors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    emailaddress = Column(String(255), nullable=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    # Relationships
    clients = relationship("Client", back_populates="advisor")
