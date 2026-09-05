import sys
import os
import json
import pandas as pd

# Ensure backend root is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.risk.data_loader import load_and_normalize_transactions
from app.risk.behavioral_profile import build_behavioral_profile
from app.risk.feature_engineering import extract_features, extract_features_batch
from app.risk.anomaly_model import train_isolation_forest, score_transaction, score_batch


def main():
    csv_path = os.path.join("data", "historical_transactions.csv")
    profile_path = os.path.join("data", "behavioral_profile.json")
    model_path = os.path.join("models", "isolation_forest.pkl")

    print("\n--- 1. Loading Data & Preparing Features ---")
    df = load_and_normalize_transactions(csv_path, source="UPI")
    profile = build_behavioral_profile(df, json_path=profile_path)
    feature_df = extract_features_batch(df, profile)

    print("\n--- 2. Training Isolation Forest Model ---")
    model, summary = train_isolation_forest(
        feature_df=feature_df,
        model_path=model_path,
        contamination="auto"
    )

    print("\n--- 3. Testing Single Transaction Scoring (score_transaction) ---")
    normal_sample = {
        "amount": 100.0,
        "recipient": "Swiggy Food Order",
        "timestamp": "2026-09-04 10:30:00",
        "category": "Food"
    }
    anomalous_sample = {
        "amount": 95000.0,
        "recipient": "Unknown Off-Shore Wallet",
        "timestamp": "2026-09-04 03:15:00",
        "category": "Crypto"
    }

    norm_feat = extract_features(normal_sample, profile)
    anom_feat = extract_features(anomalous_sample, profile)

    norm_score = score_transaction(norm_feat, model_path)
    anom_score = score_transaction(anom_feat, model_path)

    print("Normal Sample Result:")
    print(json.dumps(norm_score, indent=2))

    print("\nAnomalous Sample Result:")
    print(json.dumps(anom_score, indent=2))

    print("\n--- 4. Testing Batch Scoring (score_batch) ---")
    scored_batch_df = score_batch(feature_df, model_path)
    print(f"Scored Batch DataFrame Shape: {scored_batch_df.shape}")
    print("\nScored Batch Preview:")
    print(scored_batch_df[["amount", "deviation_from_average", "amount_zscore", "anomaly_score", "is_anomaly"]].to_string(index=False))

    print("\n[SUCCESS] Anomaly model training and scoring verified successfully.")


if __name__ == "__main__":
    main()
