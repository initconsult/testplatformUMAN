from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    nameNL = Column(String(255), nullable=False)
    nameFR = Column(String(255), nullable=True)
    nameEN = Column(String(255), nullable=True)
    nameDE = Column(String(255), nullable=True)
    descriptionNL = Column(String(255), nullable=False)
    descriptionFR = Column(String(255), nullable=True)
    descriptionEN = Column(String(255), nullable=True)
    descriptionDE = Column(String(255), nullable=True)
    question_list_id = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    questions = relationship("Question", back_populates="category")
    client_test_results = relationship("ClientTestResult", back_populates="category")
