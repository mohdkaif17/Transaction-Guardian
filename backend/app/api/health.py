from fastapi import APIRouter
from app.models.schemas import HealthResponse

router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health", response_model=HealthResponse)
def health_check():
    """
    GET /api/health
    Health-check endpoint returning system operational status.
    """
    return {"status": "ok"}
