from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base
from passlib.context import CryptContext

# Password context - gebruik dezelfde configuratie als reset script
try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    # Test bcrypt met een eenvoudig wachtwoord
    test_hash = pwd_context.hash("test")
    print("Bcrypt werkt correct in models/user.py")
except Exception as e:
    print(f"Bcrypt probleem in models/user.py: {e}")
    print("Gebruik argon2 als alternatief...")
    pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

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
        return pwd_context.verify(password_to_check, self.password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        # Beperk wachtwoord tot 72 bytes voor bcrypt compatibiliteit
        if len(password.encode('utf-8')) > 72:
            password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        
        try:
            return pwd_context.hash(password)
        except Exception:
            # Fallback naar SHA256 als laatste redmiddel
            import hashlib
            return hashlib.sha256(password.encode()).hexdigest()
