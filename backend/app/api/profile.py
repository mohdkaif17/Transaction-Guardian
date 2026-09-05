from fastapi import APIRouter, HTTPException
from app.models.schemas import BehavioralProfileResponse, DashboardSummaryResponse
from app.risk.risk_engine import get_cached_profile, analyze_transaction, resolve_path
from app.risk.data_loader import load_and_normalize_transactions

router = APIRouter(prefix="/api", tags=["Behavioral Profile"])


@router.get("/profile", response_model=BehavioralProfileResponse)
def get_behavioral_profile():
    """
    GET /api/profile
    Returns the cached user behavioral profile computed from historical_transactions.csv.
    """
    try:
        profile = get_cached_profile()
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve behavioral profile: {str(e)}")


@router.get("/dashboard", response_model=DashboardSummaryResponse)
def get_dashboard_summary():
    """
    GET /api/dashboard
    Returns real computed summary metrics and risk distribution across the historical_transactions.csv dataset.
    """
    try:
        profile = get_cached_profile()
        csv_path = resolve_path("data/historical_transactions.csv")
        df = load_and_normalize_transactions(csv_path)

        if df.empty:
            return DashboardSummaryResponse(
                total_analyzed=0,
                safe_count=0,
                review_count=0,
                high_risk_count=0,
                safe_percentage=0.0,
                review_percentage=0.0,
                high_risk_percentage=0.0,
                dataset_period="3 Days Historical Dataset",
                behavioral_profile=profile
            )

        counts = {"SAFE": 0, "REVIEW": 0, "HIGH_RISK": 0}
        for _, row in df.iterrows():
            res = analyze_transaction(row.to_dict())
            lvl = res.get("risk_level", "SAFE")
            if lvl in counts:
                counts[lvl] += 1
            elif lvl == "HIGH":
                counts["HIGH_RISK"] += 1
            else:
                counts["SAFE"] += 1

        total = len(df)
        safe_pct = round((counts["SAFE"] / total) * 100, 1) if total > 0 else 0.0
        review_pct = round((counts["REVIEW"] / total) * 100, 1) if total > 0 else 0.0
        high_pct = round((counts["HIGH_RISK"] / total) * 100, 1) if total > 0 else 0.0

        return DashboardSummaryResponse(
            total_analyzed=total,
            safe_count=counts["SAFE"],
            review_count=counts["REVIEW"],
            high_risk_count=counts["HIGH_RISK"],
            safe_percentage=safe_pct,
            review_percentage=review_pct,
            high_risk_percentage=high_pct,
            dataset_period="3 Days Historical Dataset (Sept 1–3, 2026)",
            behavioral_profile=profile
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate dashboard summary: {str(e)}")

