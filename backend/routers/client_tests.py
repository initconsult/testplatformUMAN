from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List
import uuid
from database import get_db
from models.client import Client
from models.client_test import ClientTest
from models.client_test_result import ClientTestResult
from models.test_question_list import TestQuestionList
from models.question import Question
from models.test import Test
from schemas.client_test import ClientTestCreate, ClientTestResponse

router = APIRouter()


class PublicClientPayload(BaseModel):
    name: str
    firstname: str
    emailaddress: str
    gender: str
    language: str
    bday: int = Field(1, ge=1, le=31)
    bmonth: int = Field(1, ge=1, le=12)
    byear: int
    phone: str | None = None
    mobile: str | None = None
    address: str
    zip: str
    city: str
    companyname: str
    function: str


class PublicClientTestCreate(BaseModel):
    advisor_id: int
    test_id: int
    client: PublicClientPayload


def seed_client_test_results(db: Session, client_test: ClientTest) -> None:
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
                client_test_id=client_test.id,
                weight=weight,
                category_id=question.category_id,
            )
            db.add(ctr)
            weight += 1

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
        complete=False,
    )
    db.add(db_client_test)
    db.commit()
    db.refresh(db_client_test)

    seed_client_test_results(db, db_client_test)
    db.commit()
    return db_client_test


@router.post("/public-create")
def create_public_client_test(
    payload: PublicClientTestCreate, db: Session = Depends(get_db)
):
    db_client = Client(
        **payload.client.model_dump(),
        advisors_id=payload.advisor_id,
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)

    db_client_test = ClientTest(
        test_id=payload.test_id,
        client_id=db_client.id,
        safeurl=str(uuid.uuid4()),
        complete=False,
    )
    db.add(db_client_test)
    db.commit()
    db.refresh(db_client_test)

    seed_client_test_results(db, db_client_test)
    db.commit()

    return {
        "safeurl": db_client_test.safeurl,
        "client_test_id": db_client_test.id,
        "client_id": db_client.id,
    }


@router.get("/safeurl/{safeurl}/questions")
def get_questions_by_safeurl(safeurl: str, db: Session = Depends(get_db)):
    client_test = db.query(ClientTest).filter(ClientTest.safeurl == safeurl).first()
    if not client_test:
        raise HTTPException(status_code=404, detail="Klanttest niet gevonden")

    client = db.query(Client).filter(Client.id == client_test.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Klant niet gevonden")

    test = db.query(Test).filter(Test.id == client_test.test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test niet gevonden")

    rows = (
        db.query(ClientTestResult, Question)
        .join(Question, Question.id == ClientTestResult.question_id)
        .filter(ClientTestResult.client_test_id == client_test.id)
        .order_by(ClientTestResult.weight)
        .all()
    )

    questions = [
        {
            "client_test_result_id": ctr.id,
            "question_id": q.id,
            "weight": ctr.weight,
            "category_id": ctr.category_id,
            "answer": ctr.answer,
            "questionNL": q.questionNL,
            "questionFR": q.questionFR,
            "questionEN": q.questionEN,
            "questionDE": q.questionDE,
        }
        for ctr, q in rows
    ]

    return {
        "safeurl": safeurl,
        "language": client.language,
        "test": {
            "id": test.id,
            "nameNL": test.nameNL,
            "nameFR": test.nameFR,
            "nameEN": test.nameEN,
            "nameDE": test.nameDE,
        },
        "questions": questions,
    }

@router.delete("/{client_test_id}")
def delete_client_test(client_test_id: int, db: Session = Depends(get_db)):
    db_client_test = db.query(ClientTest).filter(ClientTest.id == client_test_id).first()
    if not db_client_test:
        raise HTTPException(status_code=404, detail="Klanttest niet gevonden")
    db.delete(db_client_test)
    db.commit()
    return {"message": "Klanttest verwijderd"}
