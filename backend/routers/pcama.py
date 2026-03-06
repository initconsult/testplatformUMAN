from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.pcama import PCAMA, PCAFY, PCAFA, PCAMY
from schemas.pcama import (
    PCAMAResponse, PCAMACreate, PCAMAUpdate,
    PCAFYResponse, PCAFYCreate, PCAFYUpdate,
    PCAFAResponse, PCAFACreate, PCAFAUpdate,
    PCAMYResponse, PCAMYCreate, PCAMYUpdate
)

router = APIRouter()

# PCAMA endpoints (Adult Male)
@router.get("/pcama/", response_model=List[PCAMAResponse])
def get_pcama(db: Session = Depends(get_db)):
    return db.query(PCAMA).all()

@router.get("/pcama/{pcama_id}", response_model=PCAMAResponse)
def get_pcama_item(pcama_id: int, db: Session = Depends(get_db)):
    item = db.query(PCAMA).filter(PCAMA.id == pcama_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="PCAMA item niet gevonden")
    return item

@router.post("/pcama/", response_model=PCAMAResponse)
def create_pcama(pcama: PCAMACreate, db: Session = Depends(get_db)):
    db_item = PCAMA(**pcama.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.patch("/pcama/{pcama_id}", response_model=PCAMAResponse)
def update_pcama(pcama_id: int, pcama: PCAMAUpdate, db: Session = Depends(get_db)):
    db_item = db.query(PCAMA).filter(PCAMA.id == pcama_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="PCAMA item niet gevonden")
    
    for field, value in pcama.dict(exclude_unset=True).items():
        setattr(db_item, field, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/pcama/{pcama_id}")
def delete_pcama(pcama_id: int, db: Session = Depends(get_db)):
    db_item = db.query(PCAMA).filter(PCAMA.id == pcama_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="PCAMA item niet gevonden")
    
    db.delete(db_item)
    db.commit()
    return {"message": "PCAMA item verwijderd"}

# PCAFY endpoints (Female Young)
@router.get("/pcafy/", response_model=List[PCAFYResponse])
def get_pcafy(db: Session = Depends(get_db)):
    return db.query(PCAFY).all()

@router.post("/pcafy/", response_model=PCAFYResponse)
def create_pcafy(pcafy: PCAFYCreate, db: Session = Depends(get_db)):
    db_item = PCAFY(**pcafy.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.patch("/pcafy/{pcafy_id}", response_model=PCAFYResponse)
def update_pcafy(pcafy_id: int, pcafy: PCAFYUpdate, db: Session = Depends(get_db)):
    db_item = db.query(PCAFY).filter(PCAFY.id == pcafy_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="PCAFY item niet gevonden")
    
    for field, value in pcafy.dict(exclude_unset=True).items():
        setattr(db_item, field, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/pcafy/{pcafy_id}")
def delete_pcafy(pcafy_id: int, db: Session = Depends(get_db)):
    db_item = db.query(PCAFY).filter(PCAFY.id == pcafy_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="PCAFY item niet gevonden")
    
    db.delete(db_item)
    db.commit()
    return {"message": "PCAFY item verwijderd"}

# PCAFA endpoints (Female Adult)
@router.get("/pcafa/", response_model=List[PCAFAResponse])
def get_pcafa(db: Session = Depends(get_db)):
    return db.query(PCAFA).all()

@router.post("/pcafa/", response_model=PCAFAResponse)
def create_pcafa(pcafa: PCAFACreate, db: Session = Depends(get_db)):
    db_item = PCAFA(**pcafa.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.patch("/pcafa/{pcafa_id}", response_model=PCAFAResponse)
def update_pcafa(pcafa_id: int, pcafa: PCAFAUpdate, db: Session = Depends(get_db)):
    db_item = db.query(PCAFA).filter(PCAFA.id == pcafa_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="PCAFA item niet gevonden")
    
    for field, value in pcafa.dict(exclude_unset=True).items():
        setattr(db_item, field, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/pcafa/{pcafa_id}")
def delete_pcafa(pcafa_id: int, db: Session = Depends(get_db)):
    db_item = db.query(PCAFA).filter(PCAFA.id == pcafa_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="PCAFA item niet gevonden")
    
    db.delete(db_item)
    db.commit()
    return {"message": "PCAFA item verwijderd"}

# PCAMY endpoints (Male Young)
@router.get("/pcamy/", response_model=List[PCAMYResponse])
def get_pcamy(db: Session = Depends(get_db)):
    return db.query(PCAMY).all()

@router.post("/pcamy/", response_model=PCAMYResponse)
def create_pcamy(pcamy: PCAMYCreate, db: Session = Depends(get_db)):
    db_item = PCAMY(**pcamy.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.patch("/pcamy/{pcamy_id}", response_model=PCAMYResponse)
def update_pcamy(pcamy_id: int, pcamy: PCAMYUpdate, db: Session = Depends(get_db)):
    db_item = db.query(PCAMY).filter(PCAMY.id == pcamy_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="PCAMY item niet gevonden")
    
    for field, value in pcamy.dict(exclude_unset=True).items():
        setattr(db_item, field, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/pcamy/{pcamy_id}")
def delete_pcamy(pcamy_id: int, db: Session = Depends(get_db)):
    db_item = db.query(PCAMY).filter(PCAMY.id == pcamy_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="PCAMY item niet gevonden")
    
    db.delete(db_item)
    db.commit()
    return {"message": "PCAMY item verwijderd"}
