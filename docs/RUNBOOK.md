# Suraksha Runbook

This document explains how to install, run, test, and verify the Suraksha hybrid intrusion detection prototype on Windows PowerShell.

## Prerequisites

- Node.js 18 or newer
- Python 3.10 or newer
- PowerShell
- A browser
- MongoDB is not required for the current development flow. The backend uses an in-memory repository.

## Install Dependencies

Open PowerShell in the repository root (`D:\Suraksha`) and run:

```powershell
cd backend
npm install
cd ..\frontend
npm install
cd ..
```

Create and activate the Python environment if it is not already active:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r ml-service\requirements.txt
pip install requests
```

If PowerShell blocks activation for the current process:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
```

## Start the Application

Use one PowerShell terminal per service. Keep each terminal open.

### 1. Backend API

```powershell
cd D:\Suraksha\backend
npm start
```

Expected output:

```text
Suraksha backend running on http://localhost:5000
Persistence mode: in-memory ...
```

The backend API is available under `http://localhost:5000/api`.

### 2. Frontend Dashboard

```powershell
cd D:\Suraksha\frontend
npm run dev
```

Open `http://localhost:5173/` in a browser.

### 3. ML Service (Optional)

```powershell
cd D:\Suraksha
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --app-dir ml-service --reload --port 8000
```

The ML service is available at `http://localhost:8000`.

The service allows browser requests from the local Vite dashboard origins
`http://localhost:5173` and `http://127.0.0.1:5173` by default. Set
`FRONTEND_ORIGINS` to a comma-separated list when using a different frontend
origin.

### 4. Traffic Simulator (Optional)

Start the backend first, then run:

```powershell
cd D:\Suraksha
.\.venv\Scripts\Activate.ps1
python traffic-simulator\simulator.py
```

The default simulator sends five normal HTTP requests to the backend. The simulator script currently chooses its normal scenario from `__main__`; the repeatable attack test is the API request shown below.

## Backend Smoke Tests

Run these commands while the backend is running.

### Health

```powershell
Invoke-RestMethod http://localhost:5000/api/health | ConvertTo-Json
```

Expected: `status` is `ok`.

### Analytics Overview

```powershell
Invoke-RestMethod http://localhost:5000/api/analytics/overview | ConvertTo-Json
```

The first overview request seeds representative demo traffic and alerts. It should report non-zero `totalTraffic`, `totalAlerts`, and `activeThreats`.

### Signature Detection

```powershell
$body = @{
  sourceIP = '192.0.2.10'
  destinationIP = '10.0.0.12'
  protocol = 'HTTP'
  method = 'GET'
  endpoint = '/search?q=UNION SELECT password FROM users'
  payload = ''
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:5000/api/traffic `
  -ContentType 'application/json' `
  -Body $body | ConvertTo-Json -Depth 5
```

Expected: the response contains an `alert` with `attackType` equal to `SQL Injection` and `detectionMethod` equal to `Signature`.

### Alert Filtering

```powershell
Invoke-RestMethod 'http://localhost:5000/api/alerts?detectionMethod=Signature' | ConvertTo-Json -Depth 5
Invoke-RestMethod 'http://localhost:5000/api/alerts?severity=High' | ConvertTo-Json -Depth 5
```

### Rule Validation

This should return HTTP 400 because the regular expression is invalid:

```powershell
$invalidRule = '{"name":"Broken rule","attackType":"Test","pattern":"[","severity":"High"}'
try {
  Invoke-RestMethod -Method Post `
    -Uri http://localhost:5000/api/rules `
    -ContentType 'application/json' `
    -Body $invalidRule
} catch {
  $_.Exception.Response.StatusCode.value__
}
```

### ML Service Health and Prediction

```powershell
Invoke-RestMethod http://localhost:8000/health | ConvertTo-Json

$features = @{
  features = @{
    sourcePort = 4567
    destinationPort = 80
    packetSize = 1700
    requestLength = 800
    responseLength = 120
    protocol = 'HTTP'
    requestFrequency = 20
    connectionCount = 10
    failedAttempts = 4
    payloadLength = 700
  }
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:8000/predict `
  -ContentType 'application/json' `
  -Body $features | ConvertTo-Json
```

Expected: the ML response contains `prediction`, `confidence`, and `anomalyScore`.

## Build Verification

Run both production builds from the repository root:

```powershell
cd D:\Suraksha\backend
node --check src\server.js
Get-ChildItem src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }

cd ..\frontend
npm run build
```

A successful frontend verification ends with `built in ...` and creates `frontend/dist/`.

## Troubleshooting

### `npm` cannot find `package.json`

Run the command from the service directory. The root folder does not contain a `package.json`:

```powershell
cd D:\Suraksha\backend   # backend commands
cd D:\Suraksha\frontend  # frontend commands
```

### Port already in use

Find the process using a port:

```powershell
Get-NetTCPConnection -LocalPort 5000,5173,8000 -ErrorAction SilentlyContinue
```

Stop a known process by ID if needed:

```powershell
Stop-Process -Id <PID>
```

If port 5000 already responds to the backend health check, do not start a second backend process:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

To run another backend instance on a different port, set `PORT` for that process:

```powershell
$env:PORT = 5001
npm start
```

The frontend uses port 5000 by default. If you use another backend port, start the frontend with the matching API URL:

```powershell
$env:VITE_API_URL = 'http://localhost:5001/api'
npm run dev
```

### Frontend shows demo values

The frontend falls back to demo values when `http://localhost:5000/api` is unavailable. Start the backend and refresh the page. The backend must be running before the dashboard can show live totals and alerts.

### MongoDB

MongoDB is intentionally not required by the current development backend. Data is reset whenever the backend process restarts. The REST contracts are in place for a future MongoDB repository.

## Verification Checklist

- [ ] Backend starts on port 5000.
- [ ] `GET /api/health` returns `status: ok`.
- [ ] `GET /api/analytics/overview` returns seeded totals.
- [ ] Malicious traffic creates a signature alert.
- [ ] Alert filters return matching records.
- [ ] Invalid rule patterns return HTTP 400.
- [ ] Frontend `npm run build` succeeds.
- [ ] Dashboard loads at `http://localhost:5173/`.
- [ ] ML service health and prediction checks pass when its dependencies are installed.
