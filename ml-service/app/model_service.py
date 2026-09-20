from __future__ import annotations

from typing import Any, Dict, List

import numpy as np
import pandas as pd
import shap
from sklearn.ensemble import RandomForestClassifier


class ModelService:
    FEATURE_ORDER = [
        'sourcePort',
        'destinationPort',
        'packetSize',
        'requestLength',
        'responseLength',
        'protocol',
        'requestFrequency',
        'connectionCount',
        'failedAttempts',
        'payloadLength',
    ]

    def __init__(self) -> None:
        self.model = self._train_model()
        self.explainer = shap.TreeExplainer(self.model)

    def _train_model(self) -> RandomForestClassifier:
        records: List[Dict[str, Any]] = []

        for i in range(400):
            normal = {
                'sourcePort': 4000 + i % 200,
                'destinationPort': 80 if i % 2 == 0 else 443,
                'packetSize': 200 + (i % 80) * 10,
                'requestLength': 100 + (i % 40) * 12,
                'responseLength': 150 + (i % 50) * 15,
                'protocol': 1 if i % 3 else 0,
                'requestFrequency': 1 + (i % 6),
                'connectionCount': 1 + (i % 4),
                'failedAttempts': 0,
                'payloadLength': 80 + (i % 30) * 5,
                'label': 0,
            }
            records.append(normal)

        for i in range(400):
            suspicious = {
                'sourcePort': 1024 + i % 1200,
                'destinationPort': 21 if i % 3 == 0 else 80,
                'packetSize': 1400 + (i % 30) * 25,
                'requestLength': 600 + (i % 50) * 18,
                'responseLength': 120 + (i % 25) * 5,
                'protocol': 1 if i % 2 else 0,
                'requestFrequency': 15 + (i % 10),
                'connectionCount': 8 + (i % 6),
                'failedAttempts': 2 + (i % 6),
                'payloadLength': 600 + (i % 50) * 20,
                'label': 1,
            }
            records.append(suspicious)

        df = pd.DataFrame(records)
        X = df[self.FEATURE_ORDER]
        y = df['label']

        model = RandomForestClassifier(
            n_estimators=200,
            max_depth=6,
            random_state=42,
            class_weight='balanced',
        )
        model.fit(X, y)
        return model

    def _coerce_numeric(self, value: Any, default: float = 0.0) -> float:
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    def prepare_features(self, features: Dict[str, Any]) -> pd.DataFrame:
        row: Dict[str, Any] = {}
        for name in self.FEATURE_ORDER:
            row[name] = self._coerce_numeric(features.get(name, 0), 0.0)

        row['protocol'] = 1 if str(features.get('protocol', 'HTTP')).upper() in {'HTTP', 'HTTPS'} else 0
        row['requestLength'] = max(row.get('requestLength', 0.0), 0.0)
        row['responseLength'] = max(row.get('responseLength', 0.0), 0.0)
        row['packetSize'] = max(row.get('packetSize', 0.0), 0.0)
        row['failedAttempts'] = max(row.get('failedAttempts', 0.0), 0.0)
        row['connectionCount'] = max(row.get('connectionCount', 0.0), 0.0)
        row['requestFrequency'] = max(row.get('requestFrequency', 0.0), 0.0)

        return pd.DataFrame([row], columns=self.FEATURE_ORDER)

    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        sample = self.prepare_features(features)
        probabilities = self.model.predict_proba(sample)[0]
        attack_probability = float(probabilities[1]) if len(probabilities) > 1 else float(probabilities[0])
        prediction = 'Attack' if attack_probability >= 0.5 else 'Normal'
        confidence = round(float(max(attack_probability, 1.0 - attack_probability)), 3)
        anomaly_score = round(float(attack_probability), 3)

        return {
            'prediction': prediction,
            'confidence': confidence,
            'anomalyScore': anomaly_score,
        }

    def explain(self, features: Dict[str, Any]) -> Dict[str, Any]:
        sample = self.prepare_features(features)
        shap_values = self.explainer.shap_values(sample)

        if isinstance(shap_values, list):
            shap_array = np.asarray(shap_values[1])[0]
        else:
            shap_array = np.asarray(shap_values)
            if shap_array.ndim == 3:
                shap_array = shap_array[0, :, 1]
            elif shap_array.ndim == 2 and shap_array.shape[0] != len(self.FEATURE_ORDER):
                shap_array = shap_array[0]
            elif shap_array.ndim == 2 and shap_array.shape[1] == len(self.FEATURE_ORDER):
                shap_array = shap_array[0]
            else:
                shap_array = shap_array.reshape(-1)

        contributions = []
        for idx, name in enumerate(self.FEATURE_ORDER):
            contributions.append({
                'feature': name,
                'contribution': round(float(shap_array[idx]), 3),
            })

        top_features = sorted(contributions, key=lambda item: abs(item['contribution']), reverse=True)[:5]
        prediction = self.predict(features)

        return {
            'prediction': prediction['prediction'],
            'topFeatures': top_features,
            'details': {
                'input': features,
                'explanation': 'The model identifies the features with the largest contribution toward the suspicious score.',
            },
        }
