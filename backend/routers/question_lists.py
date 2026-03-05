from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.question_list import QuestionList
from schemas.question_list import QuestionListCreate, QuestionListUpdate, QuestionListResponse

router = APIRouter()

@router.get("/", response_model=List[QuestionListResponse])
def get_question_lists(db: Session = Depends(get_db)):
    return db.query(QuestionList).all()

@router.get("/{question_list_id}", response_model=QuestionListResponse)
def get_question_list(question_list_id: int, db: Session = Depends(get_db)):
    question_list = db.query(QuestionList).filter(QuestionList.id == question_list_id).first()
    if not question_list:
        raise HTTPException(status_code=404, detail="Vragenlijst niet gevonden")
    return question_list

@router.post("/", response_model=QuestionListResponse)
def create_question_list(question_list: QuestionListCreate, db: Session = Depends(get_db)):
    db_question_list = QuestionList(**question_list.model_dump())
    db.add(db_question_list)
    db.commit()
    db.refresh(db_question_list)
    return db_question_list

@router.patch("/{question_list_id}", response_model=QuestionListResponse)
def update_question_list(question_list_id: int, question_list: QuestionListUpdate, db: Session = Depends(get_db)):
    db_question_list = db.query(QuestionList).filter(QuestionList.id == question_list_id).first()
    if not db_question_list:
        raise HTTPException(status_code=404, detail="Vragenlijst niet gevonden")
    for key, value in question_list.model_dump(exclude_unset=True).items():
        setattr(db_question_list, key, value)
    db.commit()
    db.refresh(db_question_list)
    return db_question_list

@router.delete("/{question_list_id}")
def delete_question_list(question_list_id: int, db: Session = Depends(get_db)):
    db_question_list = db.query(QuestionList).filter(QuestionList.id == question_list_id).first()
    if not db_question_list:
        raise HTTPException(status_code=404, detail="Vragenlijst niet gevonden")
    db.delete(db_question_list)
    db.commit()
    return {"message": "Vragenlijst verwijderd"}
