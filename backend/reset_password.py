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
        
        # Probeer verschillende mogelijke kolomnamen
        possible_queries = [
            "SELECT id, username, is_admin FROM users",
            "SELECT id, name, is_admin FROM users", 
            "SELECT id, user_name, is_admin FROM users",
            "SELECT id, login, is_admin FROM users"
        ]
        
        users = None
        username_col = None
        
        for query in possible_queries:
            try:
                result = db.execute(text(query))
                users = result.fetchall()
                # Bepaal welke kolom de gebruikersnaam bevat
                if "username" in query:
                    username_col = "username"
                elif "name" in query:
                    username_col = "name"
                elif "user_name" in query:
                    username_col = "user_name"
                elif "login" in query:
                    username_col = "login"
                break
            except Exception:
                continue
        
        if not users:
            print("Geen gebruikers gevonden in de database of kon kolommen niet bepalen.")
            return
            
        print(f"\nBestaande gebruikers (gebruikersnaam kolom: {username_col}):")
        print("-" * 60)
        for user in users:
            admin_status = "Admin" if user[2] else "Gebruiker"  # is_admin is 3e kolom
            print(f"ID: {user[0]} | {user[1]} | {admin_status}")
        
        # Vraag welke gebruiker
        user_input = input(f"\nVoer {username_col} of ID in: ").strip()
        
        # Zoek gebruiker op ID of username met raw SQL
        user = None
        if user_input.isdigit():
            result = db.execute(text(f"SELECT id, {username_col} FROM users WHERE id = :user_id"), {"user_id": int(user_input)})
            user = result.fetchone()
        else:
            result = db.execute(text(f"SELECT id, {username_col} FROM users WHERE {username_col} = :username"), {"username": user_input})
            user = result.fetchone()
        
        if not user:
            print("Gebruiker niet gevonden!")
            return
        
        print(f"\nGevonden gebruiker: {user[1]} (ID: {user[0]})")
        
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
            {"hash": new_hash, "user_id": user[0]}
        )
        db.commit()
        
        print(f"\nWachtwoord voor gebruiker '{user[1]}' is succesvol bijgewerkt!")
        print("Je kunt nu inloggen met het nieuwe wachtwoord.")
        
    except Exception as e:
        print(f"Fout bij het resetten van het wachtwoord: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Wachtwoord Reset Tool ===")
    reset_user_password()
