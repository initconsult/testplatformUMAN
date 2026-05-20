from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    remember_token = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Voeg is_active en is_admin als properties toe (alle gebruikers zijn admin)
    @property
    def is_active(self):
        return True
    
    @property
    def is_admin(self):
        return True
    
    @property
    def username(self):
        return self.name

    def verify_password(self, password_to_check: str) -> bool:
        return password_to_check == self.password

    @staticmethod
    def get_password_hash(password: str) -> str:
        return password
