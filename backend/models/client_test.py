from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class ClientTest(Base):
    __tablename__ = "client_tests"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    complete = Column(Boolean, default=False)
    safeurl = Column(String(36), nullable=False, unique=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    # Relationships
    client = relationship("Client", back_populates="client_tests")
    test = relationship("Test", back_populates="client_tests")
    client_test_results = relationship("ClientTestResult", back_populates="client_test")
