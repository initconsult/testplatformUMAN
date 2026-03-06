from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers.advisors import router as advisors_router
from routers.clients import router as clients_router
from routers.tests import router as tests_router
from routers.client_tests import router as client_tests_router
from routers.categories import router as categories_router
from routers.question_lists import router as question_lists_router
from routers.questions import router as questions_router
from routers.reports import router as reports_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="U-Man Test Platform API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(advisors_router, prefix="/api/advisors", tags=["Advisors"])
app.include_router(clients_router, prefix="/api/clients", tags=["Clients"])
app.include_router(tests_router, prefix="/api/tests", tags=["Tests"])
app.include_router(client_tests_router, prefix="/api/client-tests", tags=["Client Tests"])
app.include_router(categories_router, prefix="/api/categories", tags=["Categories"])
app.include_router(question_lists_router, prefix="/api/question-lists", tags=["Question Lists"])
app.include_router(questions_router, prefix="/api/questions", tags=["Questions"])
app.include_router(reports_router, prefix="/api/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {"message": "U-Man Test Platform API v2.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
