import os
import json
import time
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timezone
from typing import Dict, Any, Tuple
from sklearn.ensemble import IsolationForest
from sklearn.svm import OneClassSVM

FEATURE_NAMES = [
    "login_hour_dev", "new_device_flag", "geo_velocity_kmh", "auth_freq_delta",
    "device_trust_score", "session_dev_hours", "resource_rarity_score",
    "failed_login_count_1h", "ip_reputation_score", "privilege_dev_flag",
    "hist_anomaly_rate", "behavior_consistency_score", "weekday_dev",
    "holiday_login_flag", "office_closed_flag", "vpn_gateway_dev",
    "asn_reputation_score", "tor_usage_flag", "proxy_detection_flag",
    "browser_fp_dev", "device_mismatch_flag", "mfa_bypass_indicator",
    "simultaneous_logins_count", "service_account_dev_flag"
]

class SentinelMLPipeline:
    def __init__(self, model_dir: str = "./ml_models"):
        self.model_dir = model_dir
        os.makedirs(self.model_dir, exist_ok=True)
        self.if_model_path = os.path.join(self.model_dir, "isolation_forest.joblib")
        self.svm_model_path = os.path.join(self.model_dir, "one_class_svm.joblib")
        self.meta_path = os.path.join(self.model_dir, "metadata.json")
        
        self.iso_forest: IsolationForest = None
        self.one_class_svm: OneClassSVM = None
        
        self.load_or_init_models()

    def load_or_init_models(self):
        if os.path.exists(self.if_model_path) and os.path.exists(self.svm_model_path):
            try:
                if_loaded = joblib.load(self.if_model_path)
                svm_loaded = joblib.load(self.svm_model_path)
                if hasattr(if_loaded, "n_features_in_") and if_loaded.n_features_in_ == len(FEATURE_NAMES):
                    self.iso_forest = if_loaded
                    self.one_class_svm = svm_loaded
                    return
            except Exception:
                pass
        
        self._fit_default_baseline()

    def _fit_default_baseline(self):
        t0 = time.time()
        n_samples = 500
        n_features = len(FEATURE_NAMES)
        
        baseline_samples = np.zeros((n_samples, n_features))
        for i in range(n_samples):
            baseline_samples[i, 0] = float(np.random.choice([0.0, 0.0, 1.0]))
            baseline_samples[i, 1] = 0.0
            baseline_samples[i, 2] = float(np.random.uniform(0.0, 25.0))
            baseline_samples[i, 3] = float(np.random.uniform(0.0, 1.0))
            baseline_samples[i, 4] = float(np.random.uniform(90.0, 100.0))
            baseline_samples[i, 5] = float(np.random.uniform(0.0, 0.5))
            baseline_samples[i, 6] = 0.05
            baseline_samples[i, 7] = 0.0
            baseline_samples[i, 8] = 0.0
            baseline_samples[i, 9] = float(np.random.choice([0.0, 1.0], p=[0.8, 0.2]))
            baseline_samples[i, 10] = 0.01
            baseline_samples[i, 11] = float(np.random.uniform(85.0, 100.0))

        self.iso_forest = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
        self.iso_forest.fit(baseline_samples)
        
        self.one_class_svm = OneClassSVM(kernel='rbf', gamma='scale', nu=0.05)
        self.one_class_svm.fit(baseline_samples)
        
        joblib.dump(self.iso_forest, self.if_model_path)
        joblib.dump(self.one_class_svm, self.svm_model_path)

        duration = time.time() - t0
        meta = {
            "training_timestamp": datetime.now(timezone.utc).isoformat(),
            "dataset_size": n_samples,
            "feature_count": n_features,
            "feature_names": FEATURE_NAMES,
            "training_duration_sec": round(duration, 3),
            "model_version": "2.0.0-enterprise",
            "parameters": {
                "isolation_forest": {"n_estimators": 100, "contamination": 0.05},
                "one_class_svm": {"kernel": "rbf", "nu": 0.05}
            }
        }
        with open(self.meta_path, "w") as f:
            json.dump(meta, f, indent=2)

    def extract_vector(self, feature_dict: Dict[str, Any]) -> np.ndarray:
        vec = []
        for key in FEATURE_NAMES:
            vec.append(float(feature_dict.get(key, 0.0)))
        return np.array(vec).reshape(1, -1)

    def predict(self, feature_dict: Dict[str, Any]) -> Dict[str, Any]:
        vector = self.extract_vector(feature_dict)
        
        if_score_raw = float(self.iso_forest.decision_function(vector)[0])
        if_pred = int(self.iso_forest.predict(vector)[0])
        
        svm_score_raw = float(self.one_class_svm.decision_function(vector)[0])
        svm_pred = int(self.one_class_svm.predict(vector)[0])
        
        if_anomaly_prob = float(1.0 / (1.0 + np.exp(if_score_raw * 5.0)))
        svm_anomaly_prob = float(1.0 / (1.0 + np.exp(svm_score_raw * 5.0)))
        
        ensemble_prob = float(0.60 * if_anomaly_prob + 0.40 * svm_anomaly_prob)
        is_anomaly = bool(ensemble_prob > 0.45 or if_pred == -1 or svm_pred == -1)
        
        confidence = float(np.clip(abs(ensemble_prob - 0.5) * 2.0, 0.60, 0.99))
        
        return {
            "model_name": "Ensemble_IsolationForest_SVM",
            "anomaly_score": round(ensemble_prob * 100.0, 2),
            "confidence_score": round(confidence * 100.0, 2),
            "prediction_probability": round(ensemble_prob, 4),
            "is_anomaly": is_anomaly,
            "if_score": round(if_score_raw, 4),
            "svm_score": round(svm_score_raw, 4)
        }

ml_pipeline = SentinelMLPipeline()
