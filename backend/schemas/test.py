from pydantic import BaseModel
from typing import Optional

class TestBase(BaseModel):
    nameNL: str
    nameFR: Optional[str] = None
    nameEN: Optional[str] = None
    nameDE: Optional[str] = None
    reporttitleNL: str
    reporttitleFR: Optional[str] = None
    reporttitleEN: Optional[str] = None
    reporttitleDE: Optional[str] = None
    descriptionNL: str
    descriptionFR: Optional[str] = None
    descriptionEN: Optional[str] = None
    descriptionDE: Optional[str] = None
    enabledNL: Optional[bool] = None
    enabledFR: Optional[bool] = None
    enabledEN: Optional[bool] = None
    enabledDE: Optional[bool] = None

class TestCreate(TestBase):
    pass

class TestUpdate(TestBase):
    nameNL: Optional[str] = None
    reporttitleNL: Optional[str] = None
    descriptionNL: Optional[str] = None

class TestResponse(TestBase):
    id: int

    class Config:
        from_attributes = True
