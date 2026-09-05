import os
import joblib
import logging
from typing import Dict, Any, Tuple, Optional
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("AnomalyModel")

# Feature columns order expected by the Isolation Forest model
FEATURE_COLUMNS = [
    "amount", "deviation_from_average", "amount_zscore",
    "is_new_recipient", "recipient_frequency", "hour",
    "is_unusual_hour", "day_of_week", "is_unusual_category"
]


def prepare_feature_matrix(df_or_dict: Any) -> pd.DataFrame:
    """Ensures features are formatted cleanly as a DataFrame with expected numerical columns."""
    if isinstance(df_or_dict, dict):
        df = pd.DataFrame([df_or_dict])
    elif isinstance(df_or_dict, pd.DataFrame):
        df = df_or_dict.copy()
    else:
        raise ValueError("Input must be a feature dictionary or pandas DataFrame.")

    # Fill missing columns with defaults if any
    for col in FEATURE_COLUMNS:
        if col not in df.columns:
            df[col] = 0.0

    # Ensure numeric types (convert booleans to float 0.0/1.0)
    matrix = df[FEATURE_COLUMNS].astype(float)
    return matrix


def train_isolation_forest(
    feature_df: pd.DataFrame, 
    model_path: str = "backend/models/isolation_forest.pkl",
    contamination: Any = "auto",
    random_state: int = 42
) -> Tuple[IsolationForest, Dict[str, Any]]:
    """
    Trains a scikit-learn IsolationForest on feature_df and saves the model using joblib.
    Prints and returns a training summary.
    """
    if feature_df is None or feature_df.empty:
        raise ValueError("Cannot train IsolationForest on an empty feature DataFrame.")

    X = prepare_feature_matrix(feature_df)

    model = IsolationForest(
        n_estimators=100,
        contamination=contamination,
        random_state=random_state
    )
    model.fit(X)

    # Calculate training predictions and decision scores
    preds = model.predict(X)  # -1 for anomaly, 1 for normal
    raw_scores = model.decision_function(X)  # lower values indicate higher anomaly likelihood

    anomalies_count = int(np.sum(preds == -1))
    total_tx = int(len(X))
    anomaly_percentage = round((anomalies_count / total_tx) * 100, 2) if total_tx > 0 else 0.0

    summary = {
        "total_transactions": total_tx,
        "anomalies_flagged": anomalies_count,
        "normal_transactions": total_tx - anomalies_count,
        "anomaly_percentage": anomaly_percentage,
        "contamination": contamination
    }

    # Save model using joblib
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    logger.info(f"IsolationForest model trained and saved to '{model_path}'.")

    # Print summary for user sanity-check
    print("\n--- ISOLATION FOREST TRAINING SUMMARY ---")
    print(f"Total Training Transactions : {total_tx}")
    print(f"Flagged Anomalies           : {anomalies_count}")
    print(f"Normal Transactions         : {total_tx - anomalies_count}")
    print(f"Anomaly Rate (% of Total)   : {anomaly_percentage}%")
    print(f"Contamination Setting       : {contamination}")
    print("------------------------------------------\n")

    return model, summary


def load_model(model_path: str = "backend/models/isolation_forest.pkl") -> Optional[IsolationForest]:
    """Loads saved Isolation Forest model from disk using joblib."""
    if os.path.exists(model_path):
        try:
            return joblib.load(model_path)
        except Exception as e:
            logger.error(f"Failed to load model from '{model_path}': {e}")
    return None


def score_transaction(
    features_dict: Dict[str, Any], 
    model_path: str = "backend/models/isolation_forest.pkl"
) -> Dict[str, Any]:
    """
    Scores a single transaction's feature dictionary using the trained Isolation Forest model.
    Returns raw anomaly_score and is_anomaly boolean.
    """
    model = load_model(model_path)
    X = prepare_feature_matrix(features_dict)

    if model is None:
        logger.warning(f"No trained model found at '{model_path}'. Fitting fallback model.")
        model = IsolationForest(n_estimators=100, contamination="auto", random_state=42)
        model.fit(X)

    raw_score = float(model.decision_function(X)[0])
    pred = int(model.predict(X)[0])
    is_anomaly = bool(pred == -1)

    return {
        "anomaly_score": round(raw_score, 4),
        "is_anomaly": is_anomaly
    }


def score_batch(
    features_df: pd.DataFrame, 
    model_path: str = "backend/models/isolation_forest.pkl"
) -> pd.DataFrame:
    """
    Batch scores a feature DataFrame for the History Scanner bulk flow.
    Returns a copy of the input DataFrame with 'anomaly_score' and 'is_anomaly' columns added.
    """
    if features_df is None or features_df.empty:
        result_df = pd.DataFrame()
        result_df["anomaly_score"] = []
        result_df["is_anomaly"] = []
        return result_df

    model = load_model(model_path)
    X = prepare_feature_matrix(features_df)

    if model is None:
        logger.warning(f"No trained model found at '{model_path}'. Fitting fallback model on batch.")
        model = IsolationForest(n_estimators=100, contamination="auto", random_state=42)
        model.fit(X)

    raw_scores = model.decision_function(X)
    preds = model.predict(X)

    result_df = features_df.copy()
    result_df["anomaly_score"] = [round(float(s), 4) for s in raw_scores]
    result_df["is_anomaly"] = [bool(p == -1) for p in preds]

    return result_df


class AnomalyDetector:
    """
    Class wrapper maintaining model reference and training / scoring operations.
    """

    def __init__(self, model_path: str = "backend/models/isolation_forest.pkl"):
        self.model_path = model_path
        self.model = load_model(model_path)

    def train(self, feature_df: pd.DataFrame, contamination: Any = "auto"):
        self.model, summary = train_isolation_forest(feature_df, self.model_path, contamination)
        return summary

    def score_single(self, features_dict: Dict[str, Any]) -> Dict[str, Any]:
        return score_transaction(features_dict, self.model_path)

    def score_batch(self, features_df: pd.DataFrame) -> pd.DataFrame:
        return score_batch(features_df, self.model_path)
