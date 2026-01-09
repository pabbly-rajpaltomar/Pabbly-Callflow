@echo off
title CallFlow Simple Start
color 0A

echo ============================================
echo    CallFlow - Simple Start
echo ============================================
echo.
echo This will start backend and frontend.
echo.
pause

:: Start backend using Node directly
cd /d "%~dp0backend"
echo Starting Backend...
start "BACKEND SERVER" cmd /k "color 0A && cd /d "%~dp0backend" && node src/server.js"

:: Wait
timeout /t 10 /nobreak

:: Start frontend
cd /d "%~dp0frontend"
echo Starting Frontend...
start "FRONTEND DASHBOARD" cmd /k "color 0B && cd /d "%~dp0frontend" && npm run dev"

:: Wait and open
timeout /t 15 /nobreak
start http://localhost:3000

echo.
echo ============================================
echo Two windows opened!
echo.
echo Backend: BACKEND SERVER
echo Frontend: FRONTEND DASHBOARD
echo.
echo Keep both open!
echo.
echo Dashboard: http://localhost:3000
echo Login: admin@callflow.com / admin123
echo.
pause
