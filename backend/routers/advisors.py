from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.advisor import Advisor
from schemas.advisor import AdvisorCreate, AdvisorUpdate, AdvisorResponse

router = APIRouter()

@router.get("/", response_model=List[AdvisorResponse])
def get_advisors(db: Session = Depends(get_db)):
    return db.query(Advisor).all()

@router.get("/{advisor_id}", response_model=AdvisorResponse)
def get_advisor(advisor_id: int, db: Session = Depends(get_db)):
    advisor = db.query(Advisor).filter(Advisor.id == advisor_id).first()
    if not advisor:
        raise HTTPException(status_code=404, detail="Adviseur niet gevonden")
    return advisor

@router.post("/", response_model=AdvisorResponse)
def create_advisor(advisor: AdvisorCreate, db: Session = Depends(get_db)):
    db_advisor = Advisor(**advisor.model_dump())
    db.add(db_advisor)
    db.commit()
    db.refresh(db_advisor)
    return db_advisor

@router.patch("/{advisor_id}", response_model=AdvisorResponse)
def update_advisor(advisor_id: int, advisor: AdvisorUpdate, db: Session = Depends(get_db)):
    db_advisor = db.query(Advisor).filter(Advisor.id == advisor_id).first()
    if not db_advisor:
        raise HTTPException(status_code=404, detail="Adviseur niet gevonden")
    for key, value in advisor.model_dump(exclude_unset=True).items():
        setattr(db_advisor, key, value)
    db.commit()
    db.refresh(db_advisor)
    return db_advisor

@router.delete("/{advisor_id}")
def delete_advisor(advisor_id: int, db: Session = Depends(get_db)):
    db_advisor = db.query(Advisor).filter(Advisor.id == advisor_id).first()
    if not db_advisor:
        raise HTTPException(status_code=404, detail="Adviseur niet gevonden")
    db.delete(db_advisor)
    db.commit()
    return {"message": "Adviseur verwijderd"}
