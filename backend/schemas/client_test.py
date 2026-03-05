from pydantic import BaseModel

class ClientTestBase(BaseModel):
    test_id: int
    client_id: int

class ClientTestCreate(ClientTestBase):
    pass

class ClientTestResponse(ClientTestBase):
    id: int
    safeurl: str
    complete: bool

    class Config:
        from_attributes = True
