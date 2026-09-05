import sys
import os
import json

# Ensure backend root is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.risk.data_loader import load_and_normalize_transactions
from app.risk.behavioral_profile import build_behavioral_profile


def main():
    csv_path = os.path.join("data", "historical_transactions.csv")
    json_path = os.path.join("data", "behavioral_profile.json")
    
    print(f"\n--- Loading normalized transactions from '{csv_path}' ---")
    df = load_and_normalize_transactions(csv_path, source="UPI")
    
    print(f"\n--- Building Behavioral Profile & Saving to '{json_path}' ---")
    profile = build_behavioral_profile(df, json_path=json_path)
    
    print("\n--- RESULTING BEHAVIORAL PROFILE ---")
    print(json.dumps(profile, indent=2))
    
    print("\n--- Verification Check ---")
    if os.path.exists(json_path):
        print(f"[SUCCESS] File '{json_path}' exists ({os.path.getsize(json_path)} bytes).")
    else:
        print(f"[ERROR] JSON file '{json_path}' was not found.")

if __name__ == "__main__":
    main()
