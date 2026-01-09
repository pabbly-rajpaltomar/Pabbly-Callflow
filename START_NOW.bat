@echo off
title CallFlow - Starting Now
color 0A

echo ========================================
echo    Starting CallFlow System
echo ========================================
echo.

cd /d "%~dp0backend"

echo Creating database...
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS callflow_db;" 2>nul

echo.
echo Running migrations...
call npm run migrate 2>nul

echo.
echo Starting Backend Server...
start "CallFlow Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"

timeout /t 10 /nobreak >nul

echo.
echo Starting Frontend Dashboard...
start "CallFlow Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================
echo    CallFlow Started!
echo ========================================
echo.
echo Two windows opened:
echo   1. Backend (port 5000)
echo   2. Frontend (port 3000)
echo.
echo Wait 30 seconds, then open:
echo   http://localhost:3000
echo.
echo Login: admin@callflow.com / admin123
echo.
echo Keep both windows open!
echo.
pause
