# Suraksha

An explainable hybrid intrusion detection and prevention system mini project based on the PRD in this repository.

## Project structure

- `backend/` — Express + MongoDB API
- `frontend/` — React + Vite dashboard
- `ml-service/` — Python FastAPI ML service
- `traffic-simulator/` — Synthetic attack/normal traffic generator
- `docs/` — project documentation, including [RUNBOOK.md](docs/RUNBOOK.md)

## Getting started

- **One-click all services**: Run `.\run-all.ps1` in PowerShell.
- Or start manually:
  1. Install dependencies in `backend/` and `frontend/` with `npm install`.
  2. Setup ML environment with `py -3.13 -m venv .venv-py313` and `pip install -r ml-service\requirements.txt`.
  3. Run backend with `cd backend && npm start`.
  4. Launch frontend with `cd frontend && npm run dev`.
  5. Run ML service with `.\start-ml.ps1`.
  6. Run traffic simulator when needed with `python traffic-simulator\simulator.py`.

The backend currently uses an in-memory repository so it can run without MongoDB during development. It exposes the traffic detection, alert, analytics, rule, blocked-IP, and AI routes; MongoDB persistence can be added behind the same route contracts.

This repo is intentionally kept simple for a college mini-project while covering detection, explainability, and simulated prevention.
