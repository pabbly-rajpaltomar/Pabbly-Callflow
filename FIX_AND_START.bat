@echo off
title CallFlow - Complete Fix and Start
color 0E

echo ========================================
echo    CallFlow - Starting Everything
echo ========================================
echo.

:: Kill any existing node processes
echo Stopping any existing servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

:: Navigate to backend
cd /d "%~dp0backend"

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

:: Run migrations
echo.
echo Setting up database...
call npm run migrate

:: Start backend in a new window
echo.
echo Starting Backend Server...
start "CallFlow Backend - Keep Open" cmd /k "cd /d "%~dp0backend" && color 0A && echo Backend Server Starting... && npm run dev"

:: Wait for backend to start
echo.
echo Waiting 15 seconds for backend to start...
timeout /t 15 /nobreak

:: Navigate to frontend
cd /d "%~dp0frontend"

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

:: Start frontend in a new window
echo.
echo Starting Frontend Dashboard...
start "CallFlow Frontend - Keep Open" cmd /k "cd /d "%~dp0frontend" && color 0B && echo Frontend Dashboard Starting... && npm run dev"

:: Wait and open browser
echo.
echo Waiting 20 seconds for servers to fully start...
timeout /t 20 /nobreak

echo.
echo Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo    CallFlow Started!
echo ========================================
echo.
echo Two windows should be open:
echo   1. CallFlow Backend - Keep Open (port 5000)
echo   2. CallFlow Frontend - Keep Open (port 3000)
echo.
echo Dashboard: http://localhost:3000
echo Login: admin@callflow.com / admin123
echo.
echo IMPORTANT: Keep both windows open!
echo.
echo If login still fails:
echo   1. Check the Backend window - it should show "Server running on port 5000"
echo   2. Check the Frontend window - it should show "Local: http://localhost:3000"
echo   3. Wait 1 minute and refresh the browser
echo.
pause
