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

# Password context - gebruik argon2 als fallback voor bcrypt problemen
try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    # Test bcrypt
    test_hash = pwd_context.hash("test")
    print("Bcrypt werkt correct.")
except Exception as e:
    print(f"Bcrypt probleem: {e}")
    print("Gebruik argon2 als alternatief...")
    pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_password_hash(password: str) -> str:
    # Beperk wachtwoord tot 72 bytes voor bcrypt compatibiliteit
    if len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    
    try:
        return pwd_context.hash(password)
    except Exception as e:
        print(f"Hash fout: {e}")
        # Fallback naar een eenvoudige hash als laatste redmiddel
        import hashlib
        return hashlib.sha256(password.encode()).hexdigest()

def reset_user_password():
    db = SessionLocal()
    
    try:
        # Eerst de tabelstructuur controleren
        print("Controleren van tabelstructuur...")
        try:
            result = db.execute(text("DESCRIBE users"))
            columns = result.fetchall()
            print("\nKolommen in users tabel:")
            for col in columns:
                print(f"  - {col[0]} ({col[1]})")
        except Exception as e:
            print(f"Kon tabelstructuur niet ophalen: {e}")
        
        # Haal alle gebruikers op met de juiste kolomnamen
        result = db.execute(text("SELECT id, name, email FROM users"))
        users = result.fetchall()
        
        if not users:
            print("Geen gebruikers gevonden in de database.")
            return
            
        print("\nBestaande gebruikers (alle gebruikers zijn admin):")
        print("-" * 70)
        for user in users:
            print(f"ID: {user[0]} | Naam: {user[1]} | Email: {user[2]}")
        
        # Vraag welke gebruiker
        user_input = input("\nVoer naam, email of ID in: ").strip()
        
        # Zoek gebruiker op ID, naam of email met raw SQL
        user = None
        if user_input.isdigit():
            result = db.execute(text("SELECT id, name, email FROM users WHERE id = :user_id"), {"user_id": int(user_input)})
            user = result.fetchone()
        elif "@" in user_input:  # Email detectie
            result = db.execute(text("SELECT id, name, email FROM users WHERE email = :email"), {"email": user_input})
            user = result.fetchone()
        else:  # Naam
            result = db.execute(text("SELECT id, name, email FROM users WHERE name = :name"), {"name": user_input})
            user = result.fetchone()
        
        if not user:
            print("Gebruiker niet gevonden!")
            return
        
        print(f"\nGevonden gebruiker: {user[1]} ({user[2]}) - ID: {user[0]}")
        
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
        
        # Update wachtwoord hash met raw SQL (gebruik 'password' kolom)
        print("Wachtwoord wordt gehashed...")
        new_hash = get_password_hash(new_password)
        print(f"Hash gegenereerd: {new_hash[:20]}...")
        db.execute(
            text("UPDATE users SET password = :hash WHERE id = :user_id"),
            {"hash": new_hash, "user_id": user[0]}
        )
        db.commit()
        
        print(f"\nWachtwoord voor gebruiker '{user[1]}' ({user[2]}) is succesvol bijgewerkt!")
        print("Je kunt nu inloggen met het nieuwe wachtwoord.")
        
    except Exception as e:
        print(f"Fout bij het resetten van het wachtwoord: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Wachtwoord Reset Tool ===")
    reset_user_password()
