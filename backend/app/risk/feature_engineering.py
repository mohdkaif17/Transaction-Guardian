from typing import Dict, Any, Union
import pandas as pd
import numpy as np


def extract_features(transaction: Dict[str, Any], behavioral_profile: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extracts numerical and categorical features for a single transaction given a behavioral profile.

    Features:
      - amount (float)
      - deviation_from_average (amount / average_amount)
      - amount_zscore ((amount - average_amount) / std_amount)
      - is_new_recipient (bool)
      - recipient_frequency (int)
      - hour (int 0..23)
      - is_unusual_hour (bool)
      - day_of_week (int 0..6)
      - is_unusual_category (bool)
    """
    profile = behavioral_profile or {}

    # Amount features
    amount = float(transaction.get("amount", 0.0))
    avg_amount = float(profile.get("average_amount", 0.0))
    std_amount = float(profile.get("std_amount", 1.0))
    if std_amount <= 0 or np.isnan(std_amount):
        std_amount = max(avg_amount * 0.5, 1.0)

    deviation_from_avg = (amount / avg_amount) if avg_amount > 0 else 1.0
    amount_zscore = ((amount - avg_amount) / std_amount) if avg_amount > 0 else 0.0

    # Recipient features
    recipient = str(transaction.get("recipient", "Unknown")).strip()
    frequent_recipients = profile.get("frequent_recipients", {})
    if isinstance(frequent_recipients, list):
        frequent_recipients = {r: 1 for r in frequent_recipients}
    elif not isinstance(frequent_recipients, dict):
        frequent_recipients = {}

    recip_lower = recipient.lower()
    is_new_recipient = True
    recipient_frequency = 0
    for r_name, count in frequent_recipients.items():
        r_lower = r_name.lower()
        if r_lower in recip_lower or recip_lower in r_lower:
            is_new_recipient = False
            recipient_frequency = count
            break

    # Time features
    ts = transaction.get("timestamp")
    if isinstance(ts, (str, pd.Timestamp)):
        dt = pd.to_datetime(ts, errors="coerce")
    elif hasattr(ts, "hour") and hasattr(ts, "weekday"):
        dt = ts
    else:
        dt = pd.Timestamp.now()

    if pd.isna(dt) or dt is None:
        dt = pd.Timestamp.now()

    hour = int(dt.hour)
    day_of_week = int(dt.weekday())

    common_hours = profile.get("common_hours", [])
    if isinstance(common_hours, list) and len(common_hours) > 0:
        is_unusual_hour = hour not in common_hours
    else:
        is_unusual_hour = False

    # Category features
    category = str(transaction.get("category", "Other")).strip()
    common_categories = profile.get("common_categories", {})
    if isinstance(common_categories, list):
        common_categories = {c: 1 for c in common_categories}
    elif not isinstance(common_categories, dict):
        common_categories = {}

    if len(common_categories) > 0:
        is_unusual_category = category not in common_categories
    else:
        is_unusual_category = False

    return {
        "amount": round(amount, 2),
        "deviation_from_average": round(float(deviation_from_avg), 4),
        "amount_zscore": round(float(amount_zscore), 4),
        "is_new_recipient": bool(is_new_recipient),
        "recipient_frequency": int(recipient_frequency),
        "hour": int(hour),
        "is_unusual_hour": bool(is_unusual_hour),
        "day_of_week": int(day_of_week),
        "is_unusual_category": bool(is_unusual_category)
    }


def extract_features_batch(df: pd.DataFrame, behavioral_profile: Dict[str, Any]) -> pd.DataFrame:
    """
    Applies extract_features to every row in a DataFrame at once, returning a feature DataFrame.
    Used for bulk training, model inference, and History Scanner upload flows.
    """
    if df is None or df.empty:
        return pd.DataFrame(columns=[
            "amount", "deviation_from_average", "amount_zscore",
            "is_new_recipient", "recipient_frequency", "hour",
            "is_unusual_hour", "day_of_week", "is_unusual_category"
        ])

    feature_rows = []
    for idx, row in df.iterrows():
        tx_dict = row.to_dict()
        feat = extract_features(tx_dict, behavioral_profile)
        feature_rows.append(feat)

    feature_df = pd.DataFrame(feature_rows)
    return feature_df
