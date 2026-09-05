import sys
import os
import json

# Ensure backend root is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.risk.risk_engine import analyze_transaction

def main():
    print("\n--- 1. Testing analyze_transaction with Normal Input ---")
    normal_tx = {
        "transaction_id": "tx_normal_01",
        "amount": 120.50,
        "recipient": "Swiggy Food Order",
        "category": "Food",
        "timestamp": "2026-09-04T10:15:00Z",
        "source": "UPI"
    }

    res_normal = analyze_transaction(normal_tx)
    print(json.dumps(res_normal, indent=2))

    print("\n--- 2. Testing analyze_transaction with High-Risk Input ---")
    anomalous_tx = {
        "transaction_id": "tx_anom_99",
        "amount": 85000.00,
        "recipient": "Unknown Off-Shore Merchant",
        "category": "Crypto",
        "timestamp": "2026-09-04T03:15:00Z",
        "source": "UPI"
    }

    res_anomalous = analyze_transaction(anomalous_tx)
    print(json.dumps(res_anomalous, indent=2))

    print("\n--- 3. Verifying Key Output Schema ---")
    expected_keys = [
        "transaction_id", "timestamp", "amount", "recipient", "category",
        "source", "risk_score", "risk_level", "reasons",
        "behavioral_comparison", "recommendation", "signals"
    ]

    for key in expected_keys:
        assert key in res_normal, f"Missing key: {key}"
        assert key in res_anomalous, f"Missing key: {key}"

    print("[SUCCESS] analyze_transaction engine pipeline verified successfully.")

if __name__ == "__main__":
    main()
