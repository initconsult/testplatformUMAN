#!/usr/bin/env python3
"""
Script om het wachtwoord van een gebruiker te resetten door een nieuwe hash aan te maken.
"""

import sys
import os
import getpass
from sqlalchemy.orm import Session

# Voeg de backend directory toe aan het pad
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models.user import User

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
