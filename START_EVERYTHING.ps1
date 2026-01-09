# CallFlow Auto Start Script
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   Starting CallFlow Automatically" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend
Set-Location "$PSScriptRoot\backend"

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev" -WindowStyle Normal

# Wait 10 seconds
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start Frontend
Write-Host "Starting Frontend Dashboard..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal

# Wait 5 seconds
Start-Sleep -Seconds 5

# Open browser
Write-Host "Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "   CallFlow Started Successfully!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Dashboard: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Login: admin@callflow.com / admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Keep the two PowerShell windows open!" -ForegroundColor Yellow
Write-Host ""
pause
