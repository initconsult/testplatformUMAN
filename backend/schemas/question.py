from pydantic import BaseModel
from typing import Optional

class QuestionBase(BaseModel):
    questionNL: str
    questionFR: Optional[str] = None
    questionEN: Optional[str] = None
    questionDE: Optional[str] = None
    ScoreYesMinorMale: int
    ScoreYesAdultMale: int
    ScoreUndefinedMinorMale: int
    ScoreUndefinedAdultMale: int
    ScoreNoMinorMale: int
    ScoreNoAdultMale: int
    ScoreYesMinorFemale: int
    ScoreYesAdultFemale: int
    ScoreUndefinedMinorFemale: int
    ScoreUndefinedAdultFemale: int
    ScoreNoMinorFemale: int
    ScoreNoAdultFemale: int
    category_id: int
    question_list_id: int
    weight: int

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(QuestionBase):
    questionNL: Optional[str] = None
    ScoreYesMinorMale: Optional[int] = None
    ScoreYesAdultMale: Optional[int] = None
    ScoreUndefinedMinorMale: Optional[int] = None
    ScoreUndefinedAdultMale: Optional[int] = None
    ScoreNoMinorMale: Optional[int] = None
    ScoreNoAdultMale: Optional[int] = None
    ScoreYesMinorFemale: Optional[int] = None
    ScoreYesAdultFemale: Optional[int] = None
    ScoreUndefinedMinorFemale: Optional[int] = None
    ScoreUndefinedAdultFemale: Optional[int] = None
    ScoreNoMinorFemale: Optional[int] = None
    ScoreNoAdultFemale: Optional[int] = None
    category_id: Optional[int] = None
    question_list_id: Optional[int] = None
    weight: Optional[int] = None

class QuestionResponse(QuestionBase):
    id: int

    class Config:
        from_attributes = True
