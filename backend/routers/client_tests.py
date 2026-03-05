from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from database import get_db
from models.client_test import ClientTest
from models.client_test_result import ClientTestResult
from models.test_question_list import TestQuestionList
from models.question import Question
from schemas.client_test import ClientTestCreate, ClientTestResponse

router = APIRouter()

@router.get("/", response_model=List[ClientTestResponse])
def get_client_tests(db: Session = Depends(get_db)):
    return db.query(ClientTest).all()

@router.get("/safeurl/{safeurl}", response_model=ClientTestResponse)
def get_client_test_by_safeurl(safeurl: str, db: Session = Depends(get_db)):
    client_test = db.query(ClientTest).filter(ClientTest.safeurl == safeurl).first()
    if not client_test:
        raise HTTPException(status_code=404, detail="Klanttest niet gevonden")
    return client_test

@router.get("/{client_test_id}", response_model=ClientTestResponse)
def get_client_test(client_test_id: int, db: Session = Depends(get_db)):
    client_test = db.query(ClientTest).filter(ClientTest.id == client_test_id).first()
    if not client_test:
        raise HTTPException(status_code=404, detail="Klanttest niet gevonden")
    return client_test

@router.post("/", response_model=ClientTestResponse)
def create_client_test(client_test: ClientTestCreate, db: Session = Depends(get_db)):
    db_client_test = ClientTest(
        test_id=client_test.test_id,
        client_id=client_test.client_id,
        safeurl=str(uuid.uuid4()),
        complete=False
    )
    db.add(db_client_test)
    db.commit()
    db.refresh(db_client_test)

    test_question_lists = db.query(TestQuestionList).filter(
        TestQuestionList.test_id == client_test.test_id
    ).all()

    weight = 1
    for tql in test_question_lists:
        questions = db.query(Question).filter(
            Question.question_list_id == tql.question_list_id
        ).all()
        for question in questions:
            ctr = ClientTestResult(
                question_id=question.id,
                client_test_id=db_client_test.id,
                weight=weight,
                category_id=question.category_id
            )
            db.add(ctr)
            weight += 1

    db.commit()
    return db_client_test

@router.delete("/{client_test_id}")
def delete_client_test(client_test_id: int, db: Session = Depends(get_db)):
    db_client_test = db.query(ClientTest).filter(ClientTest.id == client_test_id).first()
    if not db_client_test:
        raise HTTPException(status_code=404, detail="Klanttest niet gevonden")
    db.delete(db_client_test)
    db.commit()
    return {"message": "Klanttest verwijderd"}
