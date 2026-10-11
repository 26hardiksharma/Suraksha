# Start Suraksha ML Service
$ErrorActionPreference = "Stop"

$venvPython = if (Test-Path ".\.venv-py313\Scripts\python.exe") {
    ".\.venv-py313\Scripts\python.exe"
} elseif (Test-Path ".\.venv\Scripts\python.exe") {
    ".\.venv\Scripts\python.exe"
} else {
    $null
}

if (-not $venvPython) {
    Write-Error "Python virtual environment not found."
    exit 1
}

Write-Host "Starting Suraksha ML Service on http://localhost:8000..." -ForegroundColor Cyan
& $venvPython -m uvicorn app.main:app --app-dir ml-service --reload --port 8000
