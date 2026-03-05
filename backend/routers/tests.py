from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.test import Test
from schemas.test import TestCreate, TestUpdate, TestResponse

router = APIRouter()

@router.get("/", response_model=List[TestResponse])
def get_tests(db: Session = Depends(get_db)):
    return db.query(Test).all()

@router.get("/{test_id}", response_model=TestResponse)
def get_test(test_id: int, db: Session = Depends(get_db)):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test niet gevonden")
    return test

@router.post("/", response_model=TestResponse)
def create_test(test: TestCreate, db: Session = Depends(get_db)):
    db_test = Test(**test.model_dump())
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    return db_test

@router.patch("/{test_id}", response_model=TestResponse)
def update_test(test_id: int, test: TestUpdate, db: Session = Depends(get_db)):
    db_test = db.query(Test).filter(Test.id == test_id).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Test niet gevonden")
    for key, value in test.model_dump(exclude_unset=True).items():
        setattr(db_test, key, value)
    db.commit()
    db.refresh(db_test)
    return db_test

@router.delete("/{test_id}")
def delete_test(test_id: int, db: Session = Depends(get_db)):
    db_test = db.query(Test).filter(Test.id == test_id).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Test niet gevonden")
    db.delete(db_test)
    db.commit()
    return {"message": "Test verwijderd"}
