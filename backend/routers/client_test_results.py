from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models.client import Client
from models.client_test import ClientTest
from models.client_test_result import ClientTestResult
from models.question import Question

router = APIRouter()


class ClientTestAnswerUpdate(BaseModel):
    answer: int = Field(..., ge=-1, le=1)


def calculate_result(question: Question, client: Client, answer: int) -> int:
    if answer not in (-1, 0, 1):
        raise HTTPException(status_code=422, detail="Ongeldige antwoordwaarde.")

    today = date.today()
    if not client.byear or not client.bmonth or not client.bday:
        raise HTTPException(status_code=422, detail="Onvolledige geboortedatum.")

    birth_date = date(client.byear, client.bmonth, client.bday)
    age = today.year - birth_date.year - (
        (today.month, today.day) < (birth_date.month, birth_date.day)
    )

    is_adult = age >= 18
    is_male = client.gender == "M"
    is_female = client.gender == "F"

    if is_adult and is_male:
        return (
            question.ScoreYesAdultMale
            if answer == 1
            else question.ScoreUndefinedAdultMale
            if answer == 0
            else question.ScoreNoAdultMale
        )
    if is_adult and is_female:
        return (
            question.ScoreYesAdultFemale
            if answer == 1
            else question.ScoreUndefinedAdultFemale
            if answer == 0
            else question.ScoreNoAdultFemale
        )
    if not is_adult and is_male:
        return (
            question.ScoreYesMinorMale
            if answer == 1
            else question.ScoreUndefinedMinorMale
            if answer == 0
            else question.ScoreNoMinorMale
        )
    if not is_adult and is_female:
        return (
            question.ScoreYesMinorFemale
            if answer == 1
            else question.ScoreUndefinedMinorFemale
            if answer == 0
            else question.ScoreNoMinorFemale
        )

    raise HTTPException(status_code=422, detail="Ongeldig geslacht voor scoreberekening.")


@router.patch("/by-safeurl/{safeurl}/question/{question_id}")
def update_answer_by_safeurl(
    safeurl: str,
    question_id: int,
    payload: ClientTestAnswerUpdate,
    db: Session = Depends(get_db),
):
    client_test = (
        db.query(ClientTest).filter(ClientTest.safeurl == safeurl).first()
    )
    if not client_test:
        raise HTTPException(status_code=404, detail="Klanttest niet gevonden")

    ctr = (
        db.query(ClientTestResult)
        .filter(
            ClientTestResult.client_test_id == client_test.id,
            ClientTestResult.question_id == question_id,
        )
        .first()
    )
    if not ctr:
        raise HTTPException(status_code=404, detail="Vraagresultaat niet gevonden")

    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Vraag niet gevonden")

    client = db.query(Client).filter(Client.id == client_test.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Klant niet gevonden")

    ctr.answer = payload.answer
    ctr.result = calculate_result(question, client, payload.answer)
    db.commit()
    db.refresh(ctr)

    return {
        "client_test_result_id": ctr.id,
        "answer": ctr.answer,
        "result": ctr.result,
    }
