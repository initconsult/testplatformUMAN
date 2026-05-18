from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class PCAMA(Base):
    __tablename__ = "PCAMA"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    scorereport = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class PCAFY(Base):
    __tablename__ = "PCAFY"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    scorereport = Column(Integer, nullable=False)

class PCAFA(Base):
    __tablename__ = "PCAFA"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    scorereport = Column(Integer, nullable=False)

class PCAMY(Base):
    __tablename__ = "PCAMY"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    scorereport = Column(Integer, nullable=False)
