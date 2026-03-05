from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
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
    question_list_id = Column(Integer, ForeignKey("question_lists.id"), nullable=False)

    question_list = relationship("QuestionList", back_populates="categories")
    questions = relationship("Question", back_populates="category")
    client_test_results = relationship("ClientTestResult", back_populates="category")
