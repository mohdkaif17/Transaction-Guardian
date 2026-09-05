import os
import uuid
import logging
from typing import Dict, Any, Optional
import pandas as pd

from app.risk.behavioral_profile import load_behavioral_profile, build_behavioral_profile
from app.risk.feature_engineering import extract_features
from app.risk.anomaly_model import score_transaction
from app.risk.risk_fusion import fuse_risk
from app.risk.data_loader import load_and_normalize_transactions

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("RiskEngine")


def resolve_path(primary_path: str) -> str:
    """Helper to resolve file paths whether running from backend directory or workspace root."""
    if os.path.exists(primary_path):
        return primary_path

    # Try removing leading 'backend/' if running from inside backend directory
    if primary_path.startswith("backend/") or primary_path.startswith("backend\\"):
        alt_path = primary_path.replace("backend/", "").replace("backend\\", "")
        if os.path.exists(alt_path):
            return alt_path

    # Try prepending 'backend/' if running from workspace root
    alt_path2 = os.path.join("backend", primary_path)
    if os.path.exists(alt_path2):
        return alt_path2

    return primary_path


def get_cached_profile(
    profile_path: str = "data/behavioral_profile.json",
    csv_path: str = "data/historical_transactions.csv"
) -> Dict[str, Any]:
    """Retrieves cached behavioral profile or builds one if missing."""
    target_prof_path = resolve_path(profile_path)
    profile = load_behavioral_profile(target_prof_path)
    if profile is not None:
        return profile

    logger.info("No cached behavioral profile found. Building from historical dataset...")
    target_csv_path = resolve_path(csv_path)
    df = load_and_normalize_transactions(target_csv_path)
    profile = build_behavioral_profile(df, json_path=target_prof_path)
    return profile


def analyze_transaction(
    transaction_dict: Dict[str, Any],
    profile_path: str = "data/behavioral_profile.json",
    model_path: str = "models/isolation_forest.pkl"
) -> Dict[str, Any]:
    """
    The unified risk analysis engine function for Transaction Guardian.
    Ties together:
      1. Loading cached behavioral profile
      2. Feature extraction (Phase 3)
      3. Anomaly model scoring (Phase 4)
      4. Risk fusion aggregation (Phase 5)
      5. Returning the final risk response dictionary

    Every API endpoint (New Transaction, History Scanner, QR Check) normalizes
    inputs into a transaction_dict and calls this single function.
    """
    if not isinstance(transaction_dict, dict):
        transaction_dict = {}

    tx_id = transaction_dict.get("transaction_id") or transaction_dict.get("id") or f"tx_{uuid.uuid4().hex[:8]}"
    amount = float(transaction_dict.get("amount", 0.0))
    recipient = str(transaction_dict.get("recipient") or transaction_dict.get("payee") or "Unknown").strip()
    category = str(transaction_dict.get("category") or "Other").strip()
    timestamp = str(transaction_dict.get("timestamp") or pd.Timestamp.now().isoformat())
    source = str(transaction_dict.get("source") or "UPI").strip()

    normalized_tx = {
        "transaction_id": tx_id,
        "amount": amount,
        "recipient": recipient,
        "category": category,
        "timestamp": timestamp,
        "source": source
    }

    # 1. Load cached behavioral profile
    prof_file = resolve_path(profile_path)
    profile = get_cached_profile(profile_path=prof_file)

    # 2. Extract features
    features = extract_features(normalized_tx, profile)

    # 3. Score with anomaly model
    mod_file = resolve_path(model_path)
    anomaly_result = score_transaction(features, model_path=mod_file)

    # 4. Fuse risk into unified response
    fusion_result = fuse_risk(features, anomaly_result, profile)

    # 5. Build final response dict containing metadata and risk assessment
    response = {
        "transaction_id": tx_id,
        "timestamp": timestamp,
        "amount": amount,
        "recipient": recipient,
        "category": category,
        "source": source,
        "risk_score": fusion_result["risk_score"],
        "risk_level": fusion_result["risk_level"],
        "reasons": fusion_result["reasons"],
        "behavioral_comparison": fusion_result["behavioral_comparison"],
        "recommendation": fusion_result["recommendation"],
        "signals": fusion_result["signals"]
    }

    return response


class RiskEngine:
    """Class wrapper orchestrating risk evaluations."""

    def __init__(
        self,
        profile_path: str = "data/behavioral_profile.json",
        model_path: str = "models/isolation_forest.pkl"
    ):
        self.profile_path = profile_path
        self.model_path = model_path

    def analyze_transaction(self, transaction_dict: Dict[str, Any]) -> Dict[str, Any]:
        return analyze_transaction(transaction_dict, self.profile_path, self.model_path)
