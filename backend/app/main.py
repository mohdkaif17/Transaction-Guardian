from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.transactions import router as transactions_router
from app.api.profile import router as profile_router
from app.api.qr import router as qr_router

app = FastAPI(
    title="Transaction Guardian API",
    description="Real-time transaction risk scoring and behavioral anomaly detection service",
    version="1.0.0"
)

# Enable CORS for React frontend running on localhost
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health_router)
app.include_router(transactions_router)
app.include_router(profile_router)
app.include_router(qr_router)



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
