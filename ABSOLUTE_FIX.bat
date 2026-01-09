@echo off
title CallFlow - Absolute Fix
color 0A

echo ============================================================
echo              CALLFLOW - ABSOLUTE FIX
echo ============================================================
echo.
echo This will definitely fix your login issue!
echo.
pause

:: Kill all node processes
echo [Step 1/7] Stopping any existing servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 /nobreak >nul
echo Done!
echo.

:: Navigate to backend
cd /d "%~dp0backend"

:: Install dependencies if needed
echo [Step 2/7] Checking backend installation...
if not exist "node_modules" (
    echo Installing backend... This takes 2-3 minutes...
    call npm install
    if errorlevel 1 (
        echo ERROR: Backend installation failed!
        pause
        exit /b 1
    )
)
echo Backend ready!
echo.

:: Setup database
echo [Step 3/7] Setting up database...
echo Please enter your PostgreSQL password if asked.
echo Usually it's: postgres
echo.
psql -U postgres -c "DROP DATABASE IF EXISTS callflow_db;"
psql -U postgres -c "CREATE DATABASE callflow_db;"
echo.

:: Run migrations
echo [Step 4/7] Creating database tables...
call npm run migrate
echo.

:: Check frontend
cd /d "%~dp0frontend"
echo [Step 5/7] Checking frontend installation...
if not exist "node_modules" (
    echo Installing frontend... This takes 2-3 minutes...
    call npm install
    if errorlevel 1 (
        echo ERROR: Frontend installation failed!
        pause
        exit /b 1
    )
)
echo Frontend ready!
echo.

:: Start backend
cd /d "%~dp0backend"
echo [Step 6/7] Starting Backend Server...
start "🟢 BACKEND - Keep This Open!" cmd /k "title BACKEND PORT 5000 && color 0A && cd /d "%~dp0backend" && echo. && echo ============================================ && echo    BACKEND SERVER STARTING... && echo    This window MUST stay open! && echo ============================================ && echo. && npm run dev"

:: Wait for backend
echo Waiting 20 seconds for backend to start...
timeout /t 20 /nobreak >nul

:: Start frontend
cd /d "%~dp0frontend"
echo [Step 7/7] Starting Frontend Dashboard...
start "🟢 FRONTEND - Keep This Open!" cmd /k "title FRONTEND PORT 3000 && color 0B && cd /d "%~dp0frontend" && echo. && echo ============================================ && echo    FRONTEND DASHBOARD STARTING... && echo    This window MUST stay open! && echo ============================================ && echo. && npm run dev"

:: Wait and open browser
echo.
echo Waiting 30 seconds for everything to start...
timeout /t 30 /nobreak >nul

echo.
echo Opening browser...
start http://localhost:3000

echo.
echo ============================================================
echo                    SUCCESS!
echo ============================================================
echo.
echo Two windows are now open:
echo   1. 🟢 BACKEND - Keep This Open!
echo   2. 🟢 FRONTEND - Keep This Open!
echo.
echo VERY IMPORTANT: DO NOT CLOSE THOSE TWO WINDOWS!
echo.
echo Your dashboard: http://localhost:3000
echo.
echo Login credentials:
echo   Email: admin@callflow.com
echo   Password: admin123
echo.
echo If login still fails:
echo   1. Wait 1 more minute
echo   2. Refresh the browser
echo   3. Check the two windows are still open
echo   4. Make sure backend shows "Server running on port 5000"
echo.
echo You got this! The system is starting...
echo.
pause
