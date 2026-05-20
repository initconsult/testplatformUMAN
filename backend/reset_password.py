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

# Password context - gebruik argon2 voor consistentie met models/user.py
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

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
        
        # Test de hash voordat we opslaan
        print("Testen van hash verificatie...")
        test_verify = pwd_context.verify(new_password, new_hash)
        print(f"Hash verificatie test: {'GESLAAGD' if test_verify else 'GEFAALD'}")
        
        if not test_verify:
            print("WAARSCHUWING: Hash verificatie gefaald! Er kan een probleem zijn.")
        
        db.execute(
            text("UPDATE users SET password = :hash WHERE id = :user_id"),
            {"hash": new_hash, "user_id": user[0]}
        )
        db.commit()
        
        # Controleer of de hash correct is opgeslagen
        result = db.execute(text("SELECT password FROM users WHERE id = :user_id"), {"user_id": user[0]})
        stored_hash = result.fetchone()[0]
        print(f"Opgeslagen hash: {stored_hash[:20]}...")
        
        # Test de opgeslagen hash
        final_verify = pwd_context.verify(new_password, stored_hash)
        print(f"Finale verificatie test: {'GESLAAGD' if final_verify else 'GEFAALD'}")
        
        print(f"\nWachtwoord voor gebruiker '{user[1]}' ({user[2]}) is succesvol bijgewerkt!")
        if final_verify:
            print("✓ Je kunt nu inloggen met het nieuwe wachtwoord.")
        else:
            print("⚠ Er kan een probleem zijn met de hash. Probeer opnieuw.")
        
    except Exception as e:
        print(f"Fout bij het resetten van het wachtwoord: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Wachtwoord Reset Tool ===")
    reset_user_password()
