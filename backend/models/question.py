from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    questionNL = Column(String(255), nullable=False)
    questionFR = Column(String(255), nullable=True)
    questionEN = Column(String(255), nullable=True)
    questionDE = Column(String(255), nullable=True)
    ScoreYesMinorMale = Column(Integer, nullable=False)
    ScoreYesAdultMale = Column(Integer, nullable=False)
    ScoreUndefinedMinorMale = Column(Integer, nullable=False)
    ScoreUndefinedAdultMale = Column(Integer, nullable=False)
    ScoreNoMinorMale = Column(Integer, nullable=False)
    ScoreNoAdultMale = Column(Integer, nullable=False)
    ScoreYesMinorFemale = Column(Integer, nullable=False)
    ScoreYesAdultFemale = Column(Integer, nullable=False)
    ScoreUndefinedMinorFemale = Column(Integer, nullable=False)
    ScoreUndefinedAdultFemale = Column(Integer, nullable=False)
    ScoreNoMinorFemale = Column(Integer, nullable=False)
    ScoreNoAdultFemale = Column(Integer, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    question_list_id = Column(Integer, ForeignKey("question_lists.id"), nullable=False)
    weight = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    category = relationship("Category", back_populates="questions")
    question_list = relationship("QuestionList", back_populates="questions")
    client_test_results = relationship("ClientTestResult", back_populates="question")
