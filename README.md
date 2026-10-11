# Suraksha

An explainable hybrid intrusion detection and prevention system mini project based on the PRD in this repository.

## Project structure

- `backend/` — Express + MongoDB API
- `frontend/` — React + Vite dashboard
- `ml-service/` — Python FastAPI ML service
- `traffic-simulator/` — Synthetic attack/normal traffic generator
- `docs/` — project documentation, including [RUNBOOK.md](docs/RUNBOOK.md)

## Getting started

1. Install dependencies in `backend/` and `frontend/` with `npm install`.
2. Run the backend with `cd backend && npm start`.
3. Launch the frontend with `cd frontend && npm run dev`.
4. Run the ML service and traffic simulator when those integrations are needed.

The backend currently uses an in-memory repository so it can run without MongoDB during development. It exposes the traffic detection, alert, analytics, rule, blocked-IP, and AI routes; MongoDB persistence can be added behind the same route contracts.

This repo is intentionally kept simple for a college mini-project while covering detection, explainability, and simulated prevention.
