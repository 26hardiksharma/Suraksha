# Launch all Suraksha services in separate PowerShell windows
$rootDir = $PSScriptRoot

Write-Host "Starting Suraksha full stack..." -ForegroundColor Green

# 1. Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend'; Write-Host 'Starting Backend API...' -ForegroundColor Green; npm start"

# 2. ML Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir'; Write-Host 'Starting ML Service...' -ForegroundColor Cyan; .\start-ml.ps1"

# 3. Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend'; Write-Host 'Starting Frontend Dashboard...' -ForegroundColor Yellow; npm run dev"

Write-Host "All 3 services launched in separate windows!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Gray
Write-Host "ML:       http://localhost:8000" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Gray
