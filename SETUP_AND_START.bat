@echo off
color 0A
title Setup and Start CallFlow

echo ============================================
echo    CallFlow - Setup and Start
echo ============================================
echo.

cd /d "%~dp0"

echo [1/4] Creating database...
node setup-db.js
echo.

cd backend

echo [2/4] Setting up database tables...
call npm run migrate
echo.

echo [3/4] Starting Backend Server...
start "BACKEND SERVER - KEEP OPEN" cmd /k "color 0A && cd /d "%~dp0backend" && echo Backend Starting... && node src/server.js"

timeout /t 15 /nobreak

echo [4/4] Starting Frontend Dashboard...
cd /d "%~dp0frontend"
start "FRONTEND DASHBOARD - KEEP OPEN" cmd /k "color 0B && cd /d "%~dp0frontend" && echo Frontend Starting... && npm run dev"

timeout /t 20 /nobreak

echo.
echo Opening browser...
start http://localhost:3000

echo.
echo ============================================
echo    CallFlow Started Successfully!
echo ============================================
echo.
echo Dashboard: http://localhost:3000
echo Login: admin@callflow.com / admin123
echo.
echo Keep both windows open!
echo.
pause
