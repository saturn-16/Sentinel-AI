import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
from sklearn.ensemble import IsolationForest
from sklearn.svm import OneClassSVM

FEATURE_NAMES = [
    "login_hour_dev",
    "new_device_flag",
    "geo_velocity_kmh",
    "auth_freq_delta",
    "device_trust_score",
    "session_dev_hours",
    "resource_rarity_score",
    "failed_login_count_1h",
    "ip_reputation_score",
    "privilege_dev_flag",
    "hist_anomaly_rate",
    "behavior_consistency_score"
]

class SentinelMLPipeline:
    def __init__(self, model_dir: str = "./ml_models"):
        self.model_dir = model_dir
        os.makedirs(self.model_dir, exist_ok=True)
        self.if_model_path = os.path.join(self.model_dir, "isolation_forest.joblib")
        self.svm_model_path = os.path.join(self.model_dir, "one_class_svm.joblib")
        
        self.iso_forest: IsolationForest = None
        self.one_class_svm: OneClassSVM = None
        
        self.load_or_init_models()

    def load_or_init_models(self):
        if os.path.exists(self.if_model_path) and os.path.exists(self.svm_model_path):
            try:
                self.iso_forest = joblib.load(self.if_model_path)
                self.one_class_svm = joblib.load(self.svm_model_path)
                return
            except Exception:
                pass
        
        self._fit_default_baseline()

    def _fit_default_baseline(self):
        np.random.seed(42)
        normal_samples = np.random.normal(loc=[0.5, 0.0, 10.0, 1.0, 95.0, 0.2, 0.1, 0.0, 5.0, 0.0, 0.02, 95.0],
                                          scale=[0.5, 0.05, 15.0, 0.5, 3.0, 0.2, 0.1, 0.2, 2.0, 0.05, 0.01, 3.0],
                                          size=(300, 12))
        normal_samples = np.clip(normal_samples, a_min=0, a_max=None)
        
        self.iso_forest = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
        self.iso_forest.fit(normal_samples)
        
        self.one_class_svm = OneClassSVM(kernel='rbf', gamma='scale', nu=0.05)
        self.one_class_svm.fit(normal_samples)
        
        joblib.dump(self.iso_forest, self.if_model_path)
        joblib.dump(self.one_class_svm, self.svm_model_path)

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
        
        ensemble_prob = float(0.6 * if_anomaly_prob + 0.4 * svm_anomaly_prob)
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
