#!/usr/bin/env python3
"""
Script om het wachtwoord van een gebruiker te resetten door een nieuwe hash aan te maken.
"""

import sys
import os
import getpass
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

# Voeg de backend directory toe aan het pad
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Database configuratie (direct zonder andere models te importeren)
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User model (standalone om import problemen te vermijden)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

def reset_user_password():
    db: Session = SessionLocal()
    
    try:
        # Toon alle gebruikers
        users = db.query(User).all()
        if not users:
            print("Geen gebruikers gevonden in de database.")
            return
            
        print("\nBestaande gebruikers:")
        print("-" * 50)
        for user in users:
            admin_status = "Admin" if user.is_admin else "Gebruiker"
            print(f"ID: {user.id} | {user.username} | {admin_status}")
        
        # Vraag welke gebruiker
        user_input = input("\nVoer gebruikersnaam of ID in: ").strip()
        
        # Zoek gebruiker op ID of username
        user = None
        if user_input.isdigit():
            user = db.query(User).filter(User.id == int(user_input)).first()
        else:
            user = db.query(User).filter(User.username == user_input).first()
        
        if not user:
            print("Gebruiker niet gevonden!")
            return
        
        print(f"\nGevonden gebruiker: {user.username} (ID: {user.id})")
        
        # Vraag nieuw wachtwoord (verborgen input)
        new_password = getpass.getpass("Nieuw wachtwoord: ")
        if not new_password:
            print("Wachtwoord mag niet leeg zijn!")
            return
        
        # Bevestig wachtwoord
        confirm_password = getpass.getpass("Bevestig wachtwoord: ")
        if new_password != confirm_password:
            print("Wachtwoorden komen niet overeen!")
            return
        
        # Update wachtwoord hash
        user.hashed_password = User.get_password_hash(new_password)
        db.commit()
        
        print(f"\nWachtwoord voor gebruiker '{user.username}' is succesvol bijgewerkt!")
        print("Je kunt nu inloggen met het nieuwe wachtwoord.")
        
    except Exception as e:
        print(f"Fout bij het resetten van het wachtwoord: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Wachtwoord Reset Tool ===")
    reset_user_password()
