from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.client_test import ClientTest
from models.client_test_result import ClientTestResult
from models.question import Question
from models.question_list import QuestionList
from models.category import Category
from models.client import Client
from models.advisor import Advisor
from models.test import Test

router = APIRouter()

def get_report_data(safeurl: str, report_type: int, db: Session):
    client_test = db.query(ClientTest).filter(ClientTest.safeurl == safeurl).first()
    if not client_test:
        raise HTTPException(status_code=404, detail="Test niet gevonden")

    results = (
        db.query(
            func.sum(ClientTestResult.result).label("sumresult"),
            Category,
            Client,
            Advisor,
            Test,
        )
        .join(Question, Question.id == ClientTestResult.question_id)
        .join(Category, Category.id == ClientTestResult.category_id)
        .join(Client, Client.id == client_test.client_id)
        .join(Advisor, Advisor.id == Client.advisors_id)
        .join(Test, Test.id == client_test.test_id)
        .join(QuestionList, QuestionList.id == Question.question_list_id)
        .filter(ClientTestResult.client_test_id == client_test.id)
        .filter(QuestionList.report == report_type)
        .group_by(Category.id)
        .order_by(Category.id)
        .all()
    )

    return client_test, results

def build_client_info(client: Client):
    return {
        "name": client.name,
        "firstname": client.firstname,
        "companyname": client.companyname,
        "address": client.address,
        "zip": client.zip,
        "city": client.city,
        "phone": client.phone,
        "mobile": client.mobile,
        "emailaddress": client.emailaddress,
        "function": client.function,
        "byear": client.byear,
        "bmonth": client.bmonth,
        "bday": client.bday,
        "gender": client.gender,
    }

@router.get("/nl/{safeurl}")
def report_nl(safeurl: str, db: Session = Depends(get_db)):
    client_test, results = get_report_data(safeurl, 1, db)
    if not results:
        raise HTTPException(status_code=404, detail="Geen resultaten gevonden")
    return {
        "safeurl": safeurl,
        "client": build_client_info(results[0].Client),
        "advisor": results[0].Advisor.name,
        "test": results[0].Test.nameNL,
        "reporttitle": results[0].Test.reporttitleNL,
        "results": [
            {
                "category_id": r.Category.id,
                "category": r.Category.nameNL,
                "description": r.Category.descriptionNL,
                "sumresult": r.sumresult,
            }
            for r in results
        ]
    }

@router.get("/fr/{safeurl}")
def report_fr(safeurl: str, db: Session = Depends(get_db)):
    client_test, results = get_report_data(safeurl, 1, db)
    if not results:
        raise HTTPException(status_code=404, detail="Geen resultaten gevonden")
    return {
        "safeurl": safeurl,
        "client": build_client_info(results[0].Client),
        "advisor": results[0].Advisor.name,
        "test": results[0].Test.nameFR,
        "reporttitle": results[0].Test.reporttitleFR,
        "results": [
            {
                "category_id": r.Category.id,
                "category": r.Category.nameFR,
                "description": r.Category.descriptionFR,
                "sumresult": r.sumresult,
            }
            for r in results
        ]
    }

@router.get("/en/{safeurl}")
def report_en(safeurl: str, db: Session = Depends(get_db)):
    client_test, results = get_report_data(safeurl, 1, db)
    if not results:
        raise HTTPException(status_code=404, detail="Geen resultaten gevonden")
    return {
        "safeurl": safeurl,
        "client": build_client_info(results[0].Client),
        "advisor": results[0].Advisor.name,
        "test": results[0].Test.nameEN,
        "reporttitle": results[0].Test.reporttitleEN,
        "results": [
            {
                "category_id": r.Category.id,
                "category": r.Category.nameEN,
                "description": r.Category.descriptionEN,
                "sumresult": r.sumresult,
            }
            for r in results
        ]
    }

@router.get("/pca/nl/{safeurl}")
def report_pca_nl(safeurl: str, db: Session = Depends(get_db)):
    client_test, results = get_report_data(safeurl, 0, db)
    if not results:
        raise HTTPException(status_code=404, detail="Geen resultaten gevonden")
    return {
        "safeurl": safeurl,
        "client": build_client_info(results[0].Client),
        "advisor": results[0].Advisor.name,
        "test": results[0].Test.nameNL,
        "results": [
            {
                "category_id": r.Category.id,
                "category": r.Category.nameNL,
                "description": r.Category.descriptionNL,
                "sumresult": r.sumresult,
            }
            for r in results
        ]
    }

@router.get("/pca/fr/{safeurl}")
def report_pca_fr(safeurl: str, db: Session = Depends(get_db)):
    client_test, results = get_report_data(safeurl, 0, db)
    if not results:
        raise HTTPException(status_code=404, detail="Geen resultaten gevonden")
    return {
        "safeurl": safeurl,
        "client": build_client_info(results[0].Client),
        "advisor": results[0].Advisor.name,
        "test": results[0].Test.nameFR,
        "results": [
            {
                "category_id": r.Category.id,
                "category": r.Category.nameFR,
                "description": r.Category.descriptionFR,
                "sumresult": r.sumresult,
            }
            for r in results
        ]
    }

@router.get("/pca/en/{safeurl}")
def report_pca_en(safeurl: str, db: Session = Depends(get_db)):
    client_test, results = get_report_data(safeurl, 0, db)
    if not results:
        raise HTTPException(status_code=404, detail="Geen resultaten gevonden")
    return {
        "safeurl": safeurl,
        "client": build_client_info(results[0].Client),
        "advisor": results[0].Advisor.name,
        "test": results[0].Test.nameEN,
        "results": [
            {
                "category_id": r.Category.id,
                "category": r.Category.nameEN,
                "description": r.Category.descriptionEN,
                "sumresult": r.sumresult,
            }
            for r in results
        ]
    }
