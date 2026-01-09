@echo off
echo ======================================
echo CallFlow System Check
echo ======================================
echo.

echo Checking Node.js installation...
node -v >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js is NOT installed
    echo     Please install from: https://nodejs.org
) else (
    echo [OK] Node.js is installed
    node -v
)
echo.

echo Checking npm installation...
npm -v >nul 2>&1
if errorlevel 1 (
    echo [X] npm is NOT installed
) else (
    echo [OK] npm is installed
    npm -v
)
echo.

echo Checking PostgreSQL...
psql --version >nul 2>&1
if errorlevel 1 (
    echo [X] PostgreSQL is NOT installed
    echo     Please install from: https://www.postgresql.org/download/
) else (
    echo [OK] PostgreSQL is installed
    psql --version
)
echo.

echo Checking backend dependencies...
if exist "backend\node_modules" (
    echo [OK] Backend dependencies installed
) else (
    echo [!] Backend dependencies NOT installed
    echo     Run: cd backend && npm install
)
echo.

echo Checking frontend dependencies...
if exist "frontend\node_modules" (
    echo [OK] Frontend dependencies installed
) else (
    echo [!] Frontend dependencies NOT installed
    echo     Run: cd frontend && npm install
)
echo.

echo ======================================
echo Setup Summary
echo ======================================
echo.
echo To start the application:
echo 1. Double-click START_BACKEND.bat
echo 2. Double-click START_FRONTEND.bat
echo 3. Open browser: http://localhost:3000
echo 4. Login: admin@callflow.com / admin123
echo.

pause
