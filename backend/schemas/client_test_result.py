from pydantic import BaseModel
from typing import Optional

class ClientTestResultBase(BaseModel):
    question_id: int
    client_test_id: int
    weight: int
    category_id: int

class ClientTestResultUpdate(BaseModel):
    answer: int

class ClientTestResultResponse(ClientTestResultBase):
    id: int
    answer: Optional[int] = None
    result: Optional[int] = None

    class Config:
        from_attributes = True
