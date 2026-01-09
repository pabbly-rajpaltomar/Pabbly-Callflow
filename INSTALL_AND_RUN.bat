@echo off
title CallFlow - Complete Installation and Startup
color 0A

echo ========================================
echo    CallFlow Installation Wizard
echo ========================================
echo.

:: Check Node.js
echo [1/5] Checking Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo Download the LTS version and install it.
    echo Then run this script again.
    pause
    exit /b 1
)
echo [OK] Node.js is installed:
node -v
echo.

:: Check PostgreSQL
echo [2/5] Checking PostgreSQL...
psql --version >nul 2>&1
if errorlevel 1 (
    color 0E
    echo [WARNING] PostgreSQL command not found in PATH
    echo But it might still be installed...
    echo.
)
echo.

:: Create Database
echo [3/5] Creating database...
echo Please enter your PostgreSQL password when prompted.
echo.
psql -U postgres -c "CREATE DATABASE callflow_db;" 2>nul
if errorlevel 1 (
    echo Database might already exist or PostgreSQL not accessible.
    echo Continuing anyway...
)
echo.

:: Install Backend
echo [4/5] Installing backend dependencies...
echo This may take 2-3 minutes. Please wait...
cd /d "%~dp0backend"
call npm install
if errorlevel 1 (
    color 0C
    echo [ERROR] Backend installation failed!
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed!
echo.

:: Run Migrations
echo [5/5] Setting up database tables...
call npm run migrate
if errorlevel 1 (
    color 0E
    echo [WARNING] Migration failed. Will try to start anyway...
)
echo.

:: Start Backend
echo ========================================
echo    Starting Backend Server
echo ========================================
echo.
echo Backend starting on http://localhost:5000
echo.
echo IMPORTANT: Keep this window open!
echo.
start cmd /k "title CallFlow Backend && cd /d "%~dp0backend" && npm run dev"

:: Wait a bit for backend to start
timeout /t 10 /nobreak >nul

:: Install Frontend
echo.
echo Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 (
    color 0C
    echo [ERROR] Frontend installation failed!
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed!
echo.

:: Start Frontend
echo ========================================
echo    Starting Web Dashboard
echo ========================================
echo.
echo Dashboard will open at http://localhost:3000
echo.
echo Login credentials:
echo   Email: admin@callflow.com
echo   Password: admin123
echo.
echo IMPORTANT: Keep this window open too!
echo.
start cmd /k "title CallFlow Frontend && cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================
echo    CallFlow Started Successfully!
echo ========================================
echo.
echo Two new windows have opened:
echo   1. Backend Server (port 5000)
echo   2. Web Dashboard (port 3000)
echo.
echo Browser should open automatically.
echo If not, go to: http://localhost:3000
echo.
echo Login: admin@callflow.com / admin123
echo.
echo Keep all windows open while using CallFlow!
echo.
pause
