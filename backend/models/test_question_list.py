from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class TestQuestionList(Base):
    __tablename__ = "test_question_lists"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    question_list_id = Column(Integer, ForeignKey("question_lists.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    test = relationship("Test", back_populates="test_question_lists")
    question_list = relationship("QuestionList", back_populates="test_question_lists")
