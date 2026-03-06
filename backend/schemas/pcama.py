from pydantic import BaseModel
from typing import Optional

class PCAMABase(BaseModel):
    category_id: int
    score: int
    scorereport: int

class PCAMACreate(PCAMABase):
    pass

class PCAMAUpdate(BaseModel):
    category_id: Optional[int] = None
    score: Optional[int] = None
    scorereport: Optional[int] = None

class PCAMAResponse(PCAMABase):
    id: int

    class Config:
        from_attributes = True

# Hergebruik dezelfde schemas voor alle PCA tabellen
PCAFYBase = PCAMABase
PCAFYCreate = PCAMACreate
PCAFYUpdate = PCAMAUpdate
PCAFYResponse = PCAMAResponse

PCAFABase = PCAMABase
PCAFACreate = PCAMACreate
PCAFAUpdate = PCAMAUpdate
PCAFAResponse = PCAMAResponse

PCAMYBase = PCAMABase
PCAMYCreate = PCAMACreate
PCAMYUpdate = PCAMAUpdate
PCAMYResponse = PCAMAResponse
