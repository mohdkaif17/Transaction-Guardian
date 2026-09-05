import os
import json
import logging
from typing import Dict, Any, Optional, List
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("BehavioralProfile")


def build_behavioral_profile(
    df: pd.DataFrame, 
    json_path: Optional[str] = "backend/data/behavioral_profile.json",
    top_recipients_count: int = 5
) -> Dict[str, Any]:
    """
    Computes spending and behavioral profile metrics from a normalized transaction DataFrame:
      - average_amount, median_amount
      - normal_amount_range (10th - 90th percentile)
      - average_transactions_per_day
      - common_hours (top hours by transaction count)
      - frequent_recipients (top N recipients by count)
      - common_categories (category distribution)

    Saves the profile to json_path and returns it as a dictionary.
    """
    if df is None or df.empty:
        profile = {
            "total_transactions": 0,
            "average_amount": 0.0,
            "median_amount": 0.0,
            "normal_amount_range": [0.0, 0.0],
            "average_transactions_per_day": 0.0,
            "common_hours": [],
            "frequent_recipients": {},
            "common_categories": {}
        }
    else:
        # Ensure timestamp is datetime type
        if not pd.api.types.is_datetime64_any_dtype(df["timestamp"]):
            df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

        valid_df = df.dropna(subset=["amount", "timestamp"])

        total_tx = len(valid_df)
        avg_amount = float(valid_df["amount"].mean()) if total_tx > 0 else 0.0
        med_amount = float(valid_df["amount"].median()) if total_tx > 0 else 0.0

        std_amount = float(valid_df["amount"].std()) if total_tx > 1 else (avg_amount * 0.5 if avg_amount > 0 else 1.0)
        if np.isnan(std_amount) or std_amount == 0:
            std_amount = max(avg_amount * 0.5, 1.0)

        # 10th and 90th percentiles
        p10 = float(valid_df["amount"].quantile(0.10)) if total_tx > 0 else 0.0
        p90 = float(valid_df["amount"].quantile(0.90)) if total_tx > 0 else 0.0
        normal_range = [round(p10, 2), round(p90, 2)]

        # Average transactions per day
        dates = valid_df["timestamp"].dt.date
        num_unique_days = int(dates.nunique()) if not dates.empty else 1
        avg_tx_per_day = round(total_tx / max(num_unique_days, 1), 2)

        # Common hours (top 3 peak transaction hours)
        hours = valid_df["timestamp"].dt.hour
        hour_counts = hours.value_counts()
        common_hours = [int(h) for h in hour_counts.head(3).index.tolist()]

        # Frequent recipients
        rec_counts = valid_df["recipient"].value_counts()
        frequent_recipients = {str(k): int(v) for k, v in rec_counts.head(top_recipients_count).to_dict().items()}

        # Common categories
        cat_counts = valid_df["category"].value_counts()
        common_categories = {str(k): int(v) for k, v in cat_counts.to_dict().items()}

        profile = {
            "total_transactions": total_tx,
            "average_amount": round(avg_amount, 2),
            "std_amount": round(std_amount, 2),
            "median_amount": round(med_amount, 2),
            "normal_amount_range": normal_range,
            "average_transactions_per_day": avg_tx_per_day,
            "common_hours": common_hours,
            "frequent_recipients": frequent_recipients,
            "common_categories": common_categories
        }

    # Save to JSON file if specified
    if json_path:
        os.makedirs(os.path.dirname(json_path), exist_ok=True)
        try:
            with open(json_path, "w") as f:
                json.dump(profile, f, indent=2)
            logger.info(f"Behavioral profile successfully saved to '{json_path}'.")
        except Exception as e:
            logger.error(f"Failed to save behavioral profile to '{json_path}': {e}")

    return profile


def load_behavioral_profile(json_path: str = "backend/data/behavioral_profile.json") -> Optional[Dict[str, Any]]:
    """Loads saved behavioral profile from JSON file."""
    if os.path.exists(json_path):
        try:
            with open(json_path, "r") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to read behavioral profile JSON: {e}")
    return None


class BehavioralProfiler:
    """
    Class wrapper for building and retrieving user behavioral profiles.
    """

    def __init__(self, json_path: str = "backend/data/behavioral_profile.json"):
        self.json_path = json_path
        self.profile = load_behavioral_profile(json_path)

    def get_or_build(self, df: Optional[pd.DataFrame] = None) -> Dict[str, Any]:
        if self.profile is not None and df is None:
            return self.profile
        if df is not None:
            self.profile = build_behavioral_profile(df, json_path=self.json_path)
            return self.profile
        return build_behavioral_profile(pd.DataFrame(), json_path=self.json_path)

    def compute_deviation_score(self, amount: float, recipient: str, category: str, timestamp_hour: int) -> float:
        if not self.profile or self.profile.get("total_transactions", 0) == 0:
            return 0.5  # Neutral for cold-start

        score = 0.0
        avg_amt = self.profile.get("average_amount", 0.0)
        norm_range = self.profile.get("normal_amount_range", [0.0, 0.0])

        # Amount deviation check
        if amount > norm_range[1] and norm_range[1] > 0:
            score += min((amount - norm_range[1]) / norm_range[1], 1.0) * 0.4

        # Recipient check
        freq_rec = self.profile.get("frequent_recipients", {})
        if recipient not in freq_rec:
            score += 0.3

        # Hour check
        common_hrs = self.profile.get("common_hours", [])
        if timestamp_hour not in common_hrs and len(common_hrs) > 0:
            score += 0.3

        return float(np.clip(score, 0.0, 1.0))
