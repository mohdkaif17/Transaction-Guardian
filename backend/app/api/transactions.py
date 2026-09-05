import os
import io
import tempfile
from typing import List
from fastapi import APIRouter, HTTPException, UploadFile, File

from app.models.schemas import SingleTransactionRequest, RiskResponse, UploadSummaryResponse, RiskCounts
from app.risk.risk_engine import analyze_transaction
from app.risk.data_loader import load_and_normalize_transactions

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])


@router.post("/analyze", response_model=RiskResponse)
def analyze_single_transaction(transaction: SingleTransactionRequest):
    """
    POST /api/transactions/analyze
    Accepts a single transaction (amount, recipient, category, timestamp, source)
    matching the frontend's NewTransaction form and returns the risk result.
    """
    try:
        payload = transaction.model_dump()
        result = analyze_transaction(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transaction analysis failed: {str(e)}")


@router.post("/upload", response_model=UploadSummaryResponse)
def upload_transactions_csv(file: UploadFile = File(...)):
    """
    POST /api/transactions/upload
    Accepts a CSV file upload for History Scanner bulk flow.
    Normalizes input, computes risk results row-by-row via analyze_transaction(),
    and returns total count, risk level summary counts (SAFE/REVIEW/HIGH), and results list.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")

    try:
        content = file.file.read()
        buffer = io.BytesIO(content)
        normalized_df = load_and_normalize_transactions(buffer, source="UPI")

        if normalized_df.empty:
            return UploadSummaryResponse(
                total_count=0,
                counts=RiskCounts(SAFE=0, REVIEW=0, HIGH=0),
                results=[]
            )

        results = []
        counts = {"SAFE": 0, "REVIEW": 0, "HIGH_RISK": 0}

        for _, row in normalized_df.iterrows():
            row_dict = row.to_dict()
            res = analyze_transaction(row_dict)
            level = res.get("risk_level", "SAFE")
            if level in counts:
                counts[level] += 1
            else:
                counts["SAFE"] += 1
            results.append(res)

        return UploadSummaryResponse(
            total_count=len(results),
            counts=RiskCounts(
                SAFE=counts["SAFE"],
                REVIEW=counts["REVIEW"],
                HIGH_RISK=counts["HIGH_RISK"]
            ),
            results=results
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV upload processing failed: {str(e)}")
