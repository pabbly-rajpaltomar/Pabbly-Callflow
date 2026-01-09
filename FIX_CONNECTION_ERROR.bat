@echo off
title CallFlow - Connection Error Fix
color 0E

echo ========================================
echo   CallFlow Connection Error Fixer
echo ========================================
echo.
echo This will fix the "localhost refused to connect" error.
echo.

:: Stop any existing processes
echo Stopping any running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.

:: Check Node.js
echo Checking Node.js installation...
where node >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] Node.js is NOT installed or not in PATH!
    echo.
    echo Please install Node.js:
    echo 1. Go to: https://nodejs.org
    echo 2. Download LTS version
    echo 3. Install it
    echo 4. Restart your computer
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)
node -v
echo [OK] Node.js found!
echo.

:: Create database if not exists
echo Trying to create database...
psql -U postgres -c "DROP DATABASE IF EXISTS callflow_db;" 2>nul
psql -U postgres -c "CREATE DATABASE callflow_db;" 2>nul
echo (If you see errors above, that's okay - database might already exist)
echo.

:: Install Backend
echo Installing backend...
cd /d "%~dp0backend"
if not exist "node_modules" (
    echo Installing dependencies... This takes 2-3 minutes...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Installation failed!
        pause
        exit /b 1
    )
)
echo [OK] Backend ready!
echo.

:: Run migrations
echo Setting up database...
call npm run migrate
echo.

:: Install Frontend
echo Installing frontend...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo Installing dependencies... This takes 2-3 minutes...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Installation failed!
        pause
        exit /b 1
    )
)
echo [OK] Frontend ready!
echo.

:: Start Backend in new window
echo Starting backend server...
cd /d "%~dp0backend"
start "CallFlow Backend" cmd /c "npm run dev & pause"
timeout /t 5 /nobreak >nul
echo.

:: Start Frontend in new window
echo Starting frontend...
cd /d "%~dp0frontend"
start "CallFlow Frontend" cmd /c "npm run dev & pause"
echo.

echo ========================================
echo           Setup Complete!
echo ========================================
echo.
echo Two windows should have opened:
echo   1. Backend (black window)
echo   2. Frontend (black window)
echo.
echo Wait 30 seconds, then:
echo   - Browser will auto-open to: http://localhost:3000
echo   - If not, manually open: http://localhost:3000
echo.
echo Login: admin@callflow.com / admin123
echo.
echo IMPORTANT: Do NOT close the two black windows!
echo.
pause
