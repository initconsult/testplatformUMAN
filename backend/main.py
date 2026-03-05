from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import clients, tests, client_tests, client_test_results, auth

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="U-Man Test Platform API", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vue dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(clients.router, prefix="/api/clients", tags=["clients"])
app.include_router(tests.router, prefix="/api/tests", tags=["tests"])
app.include_router(client_tests.router, prefix="/api/client-tests", tags=["client-tests"])
app.include_router(client_test_results.router, prefix="/api/client-test-results", tags=["client-test-results"])

@app.get("/")
async def root():
    return {"message": "U-Man Test Platform API v2.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
