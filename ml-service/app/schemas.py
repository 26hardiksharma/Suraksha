from typing import Any, Dict, List

from pydantic import BaseModel, Field


class FeaturesPayload(BaseModel):
    features: Dict[str, Any] = Field(default_factory=dict)


class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    anomalyScore: float


class FeatureContribution(BaseModel):
    feature: str
    contribution: float


class ExplanationResponse(BaseModel):
    prediction: str
    topFeatures: List[FeatureContribution]
    details: Dict[str, Any]
