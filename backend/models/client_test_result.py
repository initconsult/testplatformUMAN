from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class ClientTestResult(Base):
    __tablename__ = "client_test_results"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    client_test_id = Column(Integer, ForeignKey("client_tests.id"), nullable=False)
    answer = Column(Integer)
    weight = Column(Integer, nullable=False)
    result = Column(Integer)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    client_test = relationship("ClientTest", back_populates="client_test_results")
    question = relationship("Question", back_populates="client_test_results")
    category = relationship("Category", back_populates="client_test_results")
