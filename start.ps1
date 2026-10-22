# Wellora - Start Frontend + Backend

Write-Host ""
Write-Host "Wellora - Starting Full-Stack..." -ForegroundColor Green
Write-Host "-----------------------------------" -ForegroundColor DarkGray

$backendPath = Join-Path $PSScriptRoot "Backend"
$frontendPath = Join-Path $PSScriptRoot "frontend"

# Start Backend
Write-Host "Starting Backend  -> http://localhost:3001" -ForegroundColor Cyan
Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$backendPath'; npm run dev"
)

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend -> http://localhost:5173" -ForegroundColor Cyan
Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$frontendPath'; npm run dev"
)

Write-Host ""
Write-Host "-----------------------------------" -ForegroundColor DarkGray
Write-Host "Both servers launching in new windows!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "   Backend:  http://localhost:3001/api/health" -ForegroundColor Yellow
Write-Host ""
