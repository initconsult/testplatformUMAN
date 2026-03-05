from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class TestQuestionList(Base):
    __tablename__ = "test_question_lists"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    question_list_id = Column(Integer, ForeignKey("question_lists.id"), nullable=False)

    test = relationship("Test", back_populates="test_question_lists")
    question_list = relationship("QuestionList", back_populates="test_question_lists")
