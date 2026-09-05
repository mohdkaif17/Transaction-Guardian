from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"


class SingleTransactionRequest(BaseModel):
    amount: float = Field(..., gt=0, description="Transaction monetary amount")
    recipient: str = Field(..., description="Payee / Merchant name")
    category: str = Field(default="Other", description="Transaction merchant category")
    timestamp: Optional[str] = Field(default=None, description="ISO timestamp of transaction")
    source: Optional[str] = Field(default="UPI", description="Source payment type: UPI or BANK")


class ReasonDetail(BaseModel):
    factor: str
    impact: int
    severity: str


class BehavioralComparison(BaseModel):
    transaction_amount: float
    user_average_amount: float
    deviation_ratio: float


class RiskSignalMatrix(BaseModel):
    amount: str
    recipient: str
    time: str
    category: str


class RiskResponse(BaseModel):
    transaction_id: str
    timestamp: str
    amount: float
    recipient: str
    category: str
    source: str
    risk_score: int
    risk_level: str
    reasons: List[ReasonDetail]
    behavioral_comparison: BehavioralComparison
    recommendation: str
    signals: RiskSignalMatrix


class RiskCounts(BaseModel):
    SAFE: int = 0
    REVIEW: int = 0
    HIGH_RISK: int = 0


class UploadSummaryResponse(BaseModel):
    total_count: int
    counts: RiskCounts
    results: List[RiskResponse]


class BehavioralProfileResponse(BaseModel):
    total_transactions: int
    average_amount: float
    std_amount: Optional[float] = 0.0
    median_amount: float
    normal_amount_range: List[float]
    average_transactions_per_day: float
    common_hours: List[int]
    frequent_recipients: Dict[str, int]
    common_categories: Dict[str, int]


class DashboardSummaryResponse(BaseModel):
    total_analyzed: int
    safe_count: int
    review_count: int
    high_risk_count: int
    safe_percentage: float
    review_percentage: float
    high_risk_percentage: float
    dataset_period: str
    behavioral_profile: BehavioralProfileResponse


class QRDecodedPayload(BaseModel):
    success: bool = True
    upi_id: Optional[str] = None
    payee_name: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = "INR"
    reference: Optional[str] = None
    payment_direction: str = "OUTGOING"


class QRAnalyzeResponse(BaseModel):
    decoded: QRDecodedPayload
    risk_result: Dict[str, Any]


