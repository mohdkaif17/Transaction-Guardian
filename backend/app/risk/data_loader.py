import os
import uuid
import logging
from typing import Optional
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("DataLoader")


def infer_category(text: str) -> str:
    """Infers a simple spending category based on payee/description keywords."""
    if not isinstance(text, str):
        return "Other"
    
    text_lower = text.lower()
    
    if any(k in text_lower for k in ["swiggy", "zomato", "restaurant", "cafe", "dining", "food"]):
        return "Food"
    if any(k in text_lower for k in ["uber", "ola", "rapido", "metro", "petrol", "fuel", "transport"]):
        return "Transport"
    if any(k in text_lower for k in ["amazon", "flipkart", "myntra", "retail", "shopping", "store"]):
        return "Shopping"
    if any(k in text_lower for k in ["netflix", "spotify", "hotstar", "cinema", "entertainment"]):
        return "Entertainment"
    if any(k in text_lower for k in ["electricity", "recharge", "bill", "broadband", "utility"]):
        return "Utilities"
    if any(k in text_lower for k in ["blinkit", "zepto", "instamart", "groceries", "mart"]):
        return "Groceries"
        
    return "Other"


def normalize_transaction_type(val: str, amount: float) -> str:
    """Normalizes transaction type to DEBIT or CREDIT."""
    if isinstance(val, str):
        val_upper = val.strip().upper()
        if "CR" in val_upper or "CREDIT" in val_upper:
            return "CREDIT"
        if "DR" in val_upper or "DEBIT" in val_upper:
            return "DEBIT"
    
    return "DEBIT" if amount >= 0 else "CREDIT"


import io

def load_and_normalize_transactions(file_path_or_buffer = "backend/data/historical_transactions.csv", source: str = "UPI", max_rows: Optional[int] = 10000) -> pd.DataFrame:
    """
    Loads raw UPI/Bank/PaySim CSV transaction exports, handles malformed/missing rows safely,
    and normalizes them into a unified schema:
    [transaction_id, timestamp, amount, transaction_type, recipient, category, source]
    """
    unified_columns = ["transaction_id", "timestamp", "amount", "transaction_type", "recipient", "category", "source"]

    try:
        if isinstance(file_path_or_buffer, str):
            if not os.path.exists(file_path_or_buffer):
                logger.warning(f"File not found at {file_path_or_buffer}. Returning empty DataFrame.")
                return pd.DataFrame(columns=unified_columns)
            raw_df = pd.read_csv(file_path_or_buffer, nrows=max_rows)
        else:
            raw_df = pd.read_csv(file_path_or_buffer, nrows=max_rows)
    except Exception as e:
        logger.error(f"Error reading CSV file or buffer: {e}")
        return pd.DataFrame(columns=unified_columns)

    initial_row_count = len(raw_df)
    if initial_row_count == 0:
        logger.warning("Loaded CSV file is empty.")
        return pd.DataFrame(columns=unified_columns)

    # Normalize column names for flexible matching
    col_map = {col: str(col).strip().lower() for col in raw_df.columns}
    raw_df_lower = raw_df.rename(columns=col_map)

    rows = []
    dropped_count = 0
    base_date = pd.Timestamp("2026-09-01 09:00:00")

    for idx, row in raw_df_lower.iterrows():
        try:
            # 1. Transaction ID
            tx_id = (
                row.get("transaction_id") or row.get("reference") or 
                row.get("ref no") or row.get("txn id") or row.get("id") or
                row.get("ref")
            )
            if pd.isna(tx_id) or not str(tx_id).strip():
                tx_id = f"TX{str(idx + 1).padStart(3, '0') if hasattr(str(idx + 1), 'padStart') else str(idx + 1).zfill(3)}"
            else:
                tx_id = str(tx_id).strip()

            # 2. Timestamp (date + time combination, datetime field, or step offset)
            timestamp_val = None
            if "timestamp" in row and pd.notna(row["timestamp"]):
                timestamp_val = pd.to_datetime(row["timestamp"], errors="coerce")
            elif "date" in row and pd.notna(row["date"]):
                date_str = str(row["date"]).strip()
                time_str = str(row["time"]).strip() if "time" in row and pd.notna(row["time"]) else ""
                combined_dt = f"{date_str} {time_str}".strip()
                timestamp_val = pd.to_datetime(combined_dt, errors="coerce")
            elif "step" in row and pd.notna(row["step"]):
                try:
                    step_hours = float(row["step"])
                    timestamp_val = base_date + pd.Timedelta(hours=step_hours)
                except Exception:
                    pass

            if pd.isna(timestamp_val) or timestamp_val is None:
                # Default synthetic timestamp based on row order
                timestamp_val = base_date + pd.Timedelta(minutes=idx * 45)

            # 3. Amount (float conversion, strip currency symbols)
            raw_amount = (
                row.get("amount") or row.get("txn amount") or row.get("value") or
                row.get("amt") or row.get("debit") or row.get("price") or row.get("total")
            )
            if pd.isna(raw_amount):
                dropped_count += 1
                continue

            amount_clean = str(raw_amount).replace("₹", "").replace("$", "").replace(",", "").strip()
            try:
                amount_float = float(amount_clean)
            except ValueError:
                dropped_count += 1
                continue

            if np.isnan(amount_float) or amount_float <= 0:
                # If negative or zero, take absolute or skip if 0
                if amount_float < 0:
                    amount_float = abs(amount_float)
                else:
                    dropped_count += 1
                    continue

            # 4. Transaction Type (DEBIT / CREDIT)
            raw_type = row.get("type") or row.get("transaction_type") or row.get("txn type")
            tx_type = normalize_transaction_type(str(raw_type) if pd.notna(raw_type) else "", amount_float)

            # 5. Recipient / Payee
            recipient_val = (
                row.get("payee") or row.get("recipient") or row.get("namedest") or
                row.get("nameorig") or row.get("merchant_category") or
                row.get("user_id") or row.get("description") or row.get("payee/counterparty") or
                row.get("merchant") or row.get("to") or row.get("details") or "Unknown"
            )
            recipient_str = str(recipient_val).strip() if pd.notna(recipient_val) else "Unknown"

            # 6. Category
            cat_val = row.get("category") or row.get("merchant_category")
            raw_type_str = str(raw_type).strip() if pd.notna(raw_type) else ""
            
            if pd.notna(cat_val) and str(cat_val).strip() and str(cat_val).strip().lower() != "nan":
                cat_str = str(cat_val).strip().capitalize()
            elif raw_type_str.upper() in ["TRANSFER", "CASH_OUT", "CASH_IN", "PAYMENT", "DEBIT"]:
                cat_str = "Shopping" if raw_type_str.upper() == "PAYMENT" else ("Transfer" if "TRANSFER" in raw_type_str.upper() else "Other")
            else:
                cat_str = infer_category(f"{recipient_str} {row.get('description', '')}")

            rows.append({
                "transaction_id": tx_id,
                "timestamp": timestamp_val,
                "amount": abs(amount_float),
                "transaction_type": tx_type,
                "recipient": recipient_str,
                "category": cat_str,
                "source": source
            })

        except Exception as err:
            logger.debug(f"Row {idx} malformed: {err}")
            dropped_count += 1

    clean_df = pd.DataFrame(rows, columns=unified_columns)

    if dropped_count > 0:
        logger.info(f"Data loading complete. Retained: {len(clean_df)} rows | Dropped malformed rows: {dropped_count} (out of {initial_row_count} total).")
    else:
        logger.info(f"Data loading complete. Retained all {len(clean_df)} rows successfully.")

    return clean_df
