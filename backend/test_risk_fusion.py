import sys
import os
import json

# Ensure backend root is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.risk.risk_fusion import fuse_risk

def main():
    print("\n--- 1. Testing SAFE Transaction Fusion ---")
    safe_features = {
        "amount": 120.00,
        "deviation_from_average": 0.92,
        "amount_zscore": -0.15,
        "is_new_recipient": False,
        "recipient_frequency": 5,
        "hour": 14,
        "is_unusual_hour": False,
        "day_of_week": 1,
        "is_unusual_category": False
    }
    safe_anomaly = {"anomaly_score": 0.12, "is_anomaly": False}
    profile = {"average_amount": 130.00}

    safe_result = fuse_risk(safe_features, safe_anomaly, profile)
    print(json.dumps(safe_result, indent=2))

    print("\n--- 2. Testing REVIEW Transaction Fusion ---")
    review_features = {
        "amount": 450.00,
        "deviation_from_average": 3.46,
        "amount_zscore": 1.85,
        "is_new_recipient": True,
        "recipient_frequency": 0,
        "hour": 11,
        "is_unusual_hour": False,
        "day_of_week": 2,
        "is_unusual_category": False
    }
    review_anomaly = {"anomaly_score": 0.02, "is_anomaly": False}

    review_result = fuse_risk(review_features, review_anomaly, profile)
    print(json.dumps(review_result, indent=2))

    print("\n--- 3. Testing HIGH Risk Transaction Fusion ---")
    high_features = {
        "amount": 95000.00,
        "deviation_from_average": 730.76,
        "amount_zscore": 5.42,
        "is_new_recipient": True,
        "recipient_frequency": 0,
        "hour": 3,
        "is_unusual_hour": True,
        "day_of_week": 6,
        "is_unusual_category": True
    }
    high_anomaly = {"anomaly_score": -0.25, "is_anomaly": True}

    high_result = fuse_risk(high_features, high_anomaly, profile)
    print(json.dumps(high_result, indent=2))

    print("\n--- 4. Verifying Dictionary Keys Match Requirements ---")
    required_keys = ["risk_score", "risk_level", "reasons", "behavioral_comparison", "recommendation", "signals"]
    for key in required_keys:
        assert key in high_result, f"Missing key: {key}"

    assert "transaction_amount" in high_result["behavioral_comparison"]
    assert "user_average_amount" in high_result["behavioral_comparison"]
    assert "deviation_ratio" in high_result["behavioral_comparison"]

    assert "amount" in high_result["signals"]
    assert "recipient" in high_result["signals"]
    assert "time" in high_result["signals"]
    assert "category" in high_result["signals"]

    print("[SUCCESS] Risk fusion logic and schema alignment verified successfully.")


if __name__ == "__main__":
    main()
