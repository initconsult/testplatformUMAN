from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class QuestionList(Base):
    __tablename__ = "question_lists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    report = Column(Integer, nullable=False)

    categories = relationship("Category", back_populates="question_list")
    questions = relationship("Question", back_populates="question_list")
    test_question_lists = relationship("TestQuestionList", back_populates="question_list")
