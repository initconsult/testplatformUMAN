from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    nameNL = Column(String(255), nullable=False)
    nameFR = Column(String(255), nullable=True)
    nameEN = Column(String(255), nullable=True)
    nameDE = Column(String(255), nullable=True)
    reporttitleNL = Column(String(255), nullable=False)
    reporttitleFR = Column(String(255), nullable=True)
    reporttitleEN = Column(String(255), nullable=True)
    reporttitleDE = Column(String(255), nullable=True)
    descriptionNL = Column(String(1500), nullable=False)
    descriptionFR = Column(String(1500), nullable=True)
    descriptionEN = Column(String(1500), nullable=True)
    descriptionDE = Column(String(1500), nullable=True)
    enabledNL = Column(Boolean, nullable=True)
    enabledFR = Column(Boolean, nullable=True)
    enabledEN = Column(Boolean, nullable=True)
    enabledDE = Column(Boolean, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    client_tests = relationship("ClientTest", back_populates="test")
    test_question_lists = relationship("TestQuestionList", back_populates="test")
