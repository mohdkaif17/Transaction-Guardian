import logging
from typing import Dict, Any, List
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("RiskFusion")

# Named constants for risk signal weightings (Easy to tune)
WEIGHT_ML_ANOMALY = 0.40         # 40%
WEIGHT_AMOUNT_DEVIATION = 0.20   # 20%
WEIGHT_NEW_RECIPIENT = 0.15      # 15%
WEIGHT_UNUSUAL_TIME = 0.10       # 10%
WEIGHT_UNUSUAL_CATEGORY = 0.05   # 5%
WEIGHT_RESERVED = 0.10           # 10% reserved for future signals

TOTAL_ACTIVE_WEIGHT = (
    WEIGHT_ML_ANOMALY +
    WEIGHT_AMOUNT_DEVIATION +
    WEIGHT_NEW_RECIPIENT +
    WEIGHT_UNUSUAL_TIME +
    WEIGHT_UNUSUAL_CATEGORY
)  # 0.90


def get_signal_severity(score_val: float) -> str:
    """Classifies a 0.0 - 1.0 signal score into LOW, MEDIUM, or HIGH severity."""
    if score_val >= 0.65:
        return "HIGH"
    elif score_val >= 0.35:
        return "MEDIUM"
    return "LOW"


def fuse_risk(features: Dict[str, Any], anomaly_result: Dict[str, Any], behavioral_profile: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Fuses Isolation Forest anomaly detection results with behavioral features to compute:
      - 0 to 100 risk score
      - Risk Level: 'SAFE' (0-40), 'REVIEW' (41-70), 'HIGH' (71-100)
      - Sorted reasons list detailing contributing factors
      - Behavioral comparison breakdown
      - Human-readable non-accusatory recommendation
      - Signal severity matrix (amount, recipient, time, category)
    """
    features = features or {}
    anomaly_result = anomaly_result or {}
    profile = behavioral_profile or {}

    tx_amount = float(features.get("amount", 0.0))
    user_avg = float(profile.get("average_amount", 0.0))
    if user_avg <= 0:
        user_avg = float(features.get("user_average_amount", tx_amount if tx_amount > 0 else 100.0))

    dev_ratio = float(features.get("deviation_from_average", tx_amount / user_avg if user_avg > 0 else 1.0))
    dev_ratio = round(dev_ratio, 2)

    # 1. ML Anomaly Signal (0.0 to 1.0)
    raw_anomaly_score = float(anomaly_result.get("anomaly_score", 0.0))
    is_anomaly = bool(anomaly_result.get("is_anomaly", False))
    # Convert raw Isolation Forest decision score (lower = more anomalous) to 0.0 - 1.0 severity
    ml_severity = 1.0 - (1.0 / (1.0 + np.exp(-raw_anomaly_score * 4.0)))
    if is_anomaly:
        ml_severity = max(ml_severity, 0.70)
    ml_severity = float(np.clip(ml_severity, 0.0, 1.0))

    # 2. Amount Deviation Signal (0.0 to 1.0)
    z_score = float(features.get("amount_zscore", 0.0))
    if z_score > 3.0 or dev_ratio > 4.0:
        amount_severity = 1.0
    elif z_score > 1.5 or dev_ratio > 2.0:
        amount_severity = 0.65
    elif z_score > 0.8 or dev_ratio > 1.3:
        amount_severity = 0.35
    else:
        amount_severity = 0.0

    # 3. New Recipient Signal (0.0 or 1.0)
    is_new_recipient = bool(features.get("is_new_recipient", False))
    recipient_severity = 1.0 if is_new_recipient else 0.0

    # 4. Unusual Time Signal (0.0 or 1.0)
    is_unusual_time = bool(features.get("is_unusual_hour", False))
    time_severity = 1.0 if is_unusual_time else 0.0

    # 5. Unusual Category Signal (0.0 or 1.0)
    is_unusual_category = bool(features.get("is_unusual_category", False))
    category_severity = 1.0 if is_unusual_category else 0.0

    # Weighted Score Calculation (scaled to 0-100)
    weighted_sum = (
        (ml_severity * WEIGHT_ML_ANOMALY) +
        (amount_severity * WEIGHT_AMOUNT_DEVIATION) +
        (recipient_severity * WEIGHT_NEW_RECIPIENT) +
        (time_severity * WEIGHT_UNUSUAL_TIME) +
        (category_severity * WEIGHT_UNUSUAL_CATEGORY)
    )

    # Normalize by active weight sum (0.90) to get 0-100 risk score
    normalized_score = (weighted_sum / TOTAL_ACTIVE_WEIGHT) * 100.0
    risk_score = int(min(max(round(normalized_score), 0), 100))

    # Risk Level Mapping
    if risk_score >= 70:
        risk_level = "HIGH_RISK"
    elif risk_score >= 40:
        risk_level = "REVIEW"
    else:
        risk_level = "SAFE"

    # Build Reasons List with impact points
    reasons = []

    if ml_severity >= 0.4:
        impact = int(round((ml_severity * WEIGHT_ML_ANOMALY / TOTAL_ACTIVE_WEIGHT) * 100))
        reasons.append({
            "factor": "Machine learning anomaly pattern",
            "impact": impact,
            "severity": get_signal_severity(ml_severity)
        })

    if amount_severity > 0:
        impact = int(round((amount_severity * WEIGHT_AMOUNT_DEVIATION / TOTAL_ACTIVE_WEIGHT) * 100))
        reasons.append({
            "factor": "Amount deviation",
            "impact": impact,
            "severity": get_signal_severity(amount_severity)
        })

    if is_new_recipient:
        impact = int(round((WEIGHT_NEW_RECIPIENT / TOTAL_ACTIVE_WEIGHT) * 100))
        reasons.append({
            "factor": "New recipient",
            "impact": impact,
            "severity": "HIGH"
        })

    if is_unusual_time:
        impact = int(round((WEIGHT_UNUSUAL_TIME / TOTAL_ACTIVE_WEIGHT) * 100))
        reasons.append({
            "factor": "Unusual transaction time",
            "impact": impact,
            "severity": "MEDIUM"
        })

    if is_unusual_category:
        impact = int(round((WEIGHT_UNUSUAL_CATEGORY / TOTAL_ACTIVE_WEIGHT) * 100))
        reasons.append({
            "factor": "Unusual merchant category",
            "impact": impact,
            "severity": "LOW"
        })

    # Sort reasons by impact descending
    reasons.sort(key=lambda x: x["impact"], reverse=True)

    # Non-accusatory recommendation text
    if risk_level == "HIGH":
        recommendation = "This transaction shows a significant deviation from your normal spending pattern. Verification recommended before completing payment."
    elif risk_level == "REVIEW":
        recommendation = "This transaction contains unusual characteristics (such as a new recipient or unfamiliar timing). Please double-check details."
    else:
        recommendation = "Transaction aligns with your typical behavioral pattern. Safe to proceed."

    # Signals matrix
    signals = {
        "amount": get_signal_severity(amount_severity),
        "recipient": get_signal_severity(recipient_severity),
        "time": get_signal_severity(time_severity),
        "category": get_signal_severity(category_severity)
    }

    # Behavioral Comparison
    behavioral_comparison = {
        "transaction_amount": round(tx_amount, 2),
        "user_average_amount": round(user_avg, 2),
        "deviation_ratio": dev_ratio
    }

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons,
        "behavioral_comparison": behavioral_comparison,
        "recommendation": recommendation,
        "signals": signals
    }
