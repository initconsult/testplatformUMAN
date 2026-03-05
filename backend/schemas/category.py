from pydantic import BaseModel
from typing import Optional

class CategoryBase(BaseModel):
    nameNL: str
    nameFR: Optional[str] = None
    nameEN: Optional[str] = None
    nameDE: Optional[str] = None
    descriptionNL: str
    descriptionFR: Optional[str] = None
    descriptionEN: Optional[str] = None
    descriptionDE: Optional[str] = None
    question_list_id: int

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    nameNL: Optional[str] = None
    descriptionNL: Optional[str] = None
    question_list_id: Optional[int] = None

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True
