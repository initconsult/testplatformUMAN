from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from database import get_db
from models.test import Test
from schemas.test import TestCreate, TestUpdate, TestResponse

router = APIRouter()

@router.get("/", response_model=List[TestResponse])
def get_tests(db: Session = Depends(get_db)):
    return db.query(Test).all()

@router.get("/by-name/{test_name}")
def get_test_by_name(test_name: str, db: Session = Depends(get_db)):
    test = (
        db.query(Test)
        .filter(
            or_(
                Test.nameNL.ilike(test_name),
                Test.nameFR.ilike(test_name),
                Test.nameEN.ilike(test_name),
                Test.nameDE.ilike(test_name),
            )
        )
        .first()
    )
    if not test:
        raise HTTPException(status_code=404, detail="Test niet gevonden")

    normalized = test_name.casefold()
    language = "NL"
    if test.nameFR and test.nameFR.casefold() == normalized:
        language = "FR"
    if test.nameEN and test.nameEN.casefold() == normalized:
        language = "EN"
    if test.nameDE and test.nameDE.casefold() == normalized:
        language = "DE"

    return {
        "language": language,
        "test": {
            "id": test.id,
            "nameNL": test.nameNL,
            "nameFR": test.nameFR,
            "nameEN": test.nameEN,
            "nameDE": test.nameDE,
            "descriptionNL": test.descriptionNL,
            "descriptionFR": test.descriptionFR,
            "descriptionEN": test.descriptionEN,
            "descriptionDE": test.descriptionDE,
            "enabledNL": test.enabledNL,
            "enabledFR": test.enabledFR,
            "enabledEN": test.enabledEN,
            "enabledDE": test.enabledDE,
        },
    }


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
