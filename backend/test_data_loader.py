import sys
import os

# Ensure backend root is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.risk.data_loader import load_and_normalize_transactions

def main():
    csv_path = os.path.join("data", "historical_transactions.csv")
    print(f"\n--- Loading and Normalizing Transactions from '{csv_path}' ---")
    
    df = load_and_normalize_transactions(csv_path, source="UPI")
    
    print("\n--- Total Normalized Row Count ---")
    print(f"Total Rows: {len(df)}")
    
    print("\n--- First 5 Normalized Rows ---")
    print(df.head(5).to_string(index=False))
    print("\n--- Schema Info ---")
    print(df.dtypes)

if __name__ == "__main__":
    main()
