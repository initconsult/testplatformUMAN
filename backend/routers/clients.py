from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.client import Client
from schemas.client import ClientCreate, ClientUpdate, ClientResponse

router = APIRouter()

@router.get("/", response_model=List[ClientResponse])
def get_clients(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Client)
    if search:
        query = query.filter(
            Client.name.ilike(f"%{search}%") |
            Client.firstname.ilike(f"%{search}%") |
            Client.companyname.ilike(f"%{search}%") |
            Client.emailaddress.ilike(f"%{search}%")
        )
    return query.all()

@router.get("/{client_id}", response_model=ClientResponse)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Klant niet gevonden")
    return client

@router.post("/", response_model=ClientResponse)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    db_client = Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.patch("/{client_id}", response_model=ClientResponse)
def update_client(client_id: int, client: ClientUpdate, db: Session = Depends(get_db)):
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Klant niet gevonden")
    for key, value in client.model_dump(exclude_unset=True).items():
        setattr(db_client, key, value)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Klant niet gevonden")
    db.delete(db_client)
    db.commit()
    return {"message": "Klant verwijderd"}
