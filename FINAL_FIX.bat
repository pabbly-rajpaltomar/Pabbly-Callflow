@echo off
color 0A
title Final Fix

echo Fixing database...
cd /d "%~dp0backend"
call npm run migrate

echo.
echo Starting backend...
start "BACKEND" cmd /k "cd /d "%~dp0backend" && node src/server.js"

timeout /t 15 /nobreak

echo Starting frontend...
start "FRONTEND" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 15 /nobreak

start http://localhost:3000

echo.
echo Done! Browser opening...
echo Login: admin@callflow.com / admin123
pause
