from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class QuestionList(Base):
    __tablename__ = "question_lists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    report = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    categories = relationship("Category", back_populates="question_list")
    questions = relationship("Question", back_populates="question_list")
    test_question_lists = relationship("TestQuestionList", back_populates="question_list")
