from sqlalchemy import Column, Integer, String
from database import Base

class PCAMA(Base):
    __tablename__ = "PCAMA"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    scorereport = Column(Integer, nullable=False)

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
