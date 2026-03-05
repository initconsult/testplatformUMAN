from pydantic import BaseModel
from typing import Optional

class QuestionListBase(BaseModel):
    name: str
    report: int

class QuestionListCreate(QuestionListBase):
    pass

class QuestionListUpdate(QuestionListBase):
    name: Optional[str] = None
    report: Optional[int] = None

class QuestionListResponse(QuestionListBase):
    id: int

    class Config:
        from_attributes = True
