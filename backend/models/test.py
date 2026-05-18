from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    nameNL = Column(String(255), nullable=False)
    nameFR = Column(String(255))
    nameEN = Column(String(255))
    nameDE = Column(String(255))
    reporttitleNL = Column(String(255), nullable=False)
    reporttitleFR = Column(String(255))
    reporttitleEN = Column(String(255))
    reporttitleDE = Column(String(255))
    descriptionNL = Column(Text, nullable=False)
    descriptionFR = Column(Text)
    descriptionEN = Column(Text)
    descriptionDE = Column(Text)
    enabledNL = Column(Boolean)
    enabledFR = Column(Boolean)
    enabledEN = Column(Boolean)
    enabledDE = Column(Boolean)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    client_tests = relationship("ClientTest", back_populates="test")
    test_question_lists = relationship("TestQuestionList", back_populates="test")
