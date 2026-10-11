import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.model_service import ModelService
from app.schemas import ExplanationResponse, FeaturesPayload, PredictionResponse

app = FastAPI(title='Suraksha ML Service')
frontend_origins = [
    origin.strip()
    for origin in os.getenv(
        'FRONTEND_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=['GET', 'POST', 'OPTIONS'],
    allow_headers=['*'],
)
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
