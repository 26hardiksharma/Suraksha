from fastapi import FastAPI

from app.model_service import ModelService
from app.schemas import ExplanationResponse, FeaturesPayload, PredictionResponse

app = FastAPI(title='Suraksha ML Service')
model_service = ModelService()


@app.get('/health')
def health():
    return {
        'status': 'ok',
        'service': 'suraksha-ml',
        'model': 'random_forest_classifier',
        'timestamp': '2026-09-15T00:00:00Z',
    }


@app.post('/predict', response_model=PredictionResponse)
def predict(payload: FeaturesPayload):
    return model_service.predict(payload.features)


@app.post('/explain', response_model=ExplanationResponse)
def explain(payload: FeaturesPayload):
    return model_service.explain(payload.features)
