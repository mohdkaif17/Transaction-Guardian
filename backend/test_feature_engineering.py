import sys
import os
import json
import pandas as pd

# Ensure backend root is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.risk.data_loader import load_and_normalize_transactions
from app.risk.behavioral_profile import build_behavioral_profile
from app.risk.feature_engineering import extract_features, extract_features_batch


def main():
    csv_path = os.path.join("data", "historical_transactions.csv")
    json_path = os.path.join("data", "behavioral_profile.json")

    print("\n--- 1. Loading Transactions & Behavioral Profile ---")
    df = load_and_normalize_transactions(csv_path, source="UPI")
    profile = build_behavioral_profile(df, json_path=json_path)

    print("\n--- 2. Single Transaction Feature Extraction ---")
    sample_tx = {
        "amount": 7500.00,
        "recipient": "Unknown High Risk Merchant",
        "timestamp": "2026-09-04 03:15:00",
        "category": "Gambling"
    }

    single_features = extract_features(sample_tx, profile)
    print("Sample Transaction Input:")
    print(json.dumps(sample_tx, indent=2))
    print("\nExtracted Feature Dict:")
    print(json.dumps(single_features, indent=2))

    print("\n--- 3. Batch Feature Extraction (extract_features_batch) ---")
    feature_df = extract_features_batch(df, profile)
    print(f"Batch Feature DataFrame Shape: {feature_df.shape}")
    print("\nBatch Feature DataFrame Preview:")
    print(feature_df.to_string(index=False))

    print("\n[SUCCESS] Feature engineering verified successfully.")


if __name__ == "__main__":
    main()
