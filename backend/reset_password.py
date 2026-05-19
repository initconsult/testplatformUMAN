#!/usr/bin/env python3
"""
Script om het wachtwoord van een gebruiker te resetten door een nieuwe hash aan te maken.
"""

import os
import getpass
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Database configuratie (volledig geïsoleerd)
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("DATABASE_URL environment variable is niet ingesteld!")
    exit(1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def reset_user_password():
    db = SessionLocal()
    
    try:
        # Toon alle gebruikers met raw SQL
        result = db.execute(text("SELECT id, username, is_admin FROM users"))
        users = result.fetchall()
        
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
        
        # Zoek gebruiker op ID of username met raw SQL
        user = None
        if user_input.isdigit():
            result = db.execute(text("SELECT id, username FROM users WHERE id = :user_id"), {"user_id": int(user_input)})
            user = result.fetchone()
        else:
            result = db.execute(text("SELECT id, username FROM users WHERE username = :username"), {"username": user_input})
            user = result.fetchone()
        
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
        
        # Update wachtwoord hash met raw SQL
        new_hash = get_password_hash(new_password)
        db.execute(
            text("UPDATE users SET hashed_password = :hash WHERE id = :user_id"),
            {"hash": new_hash, "user_id": user.id}
        )
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
