@echo off
echo ======================================
echo Starting CallFlow Backend Server
echo ======================================
echo.

cd /d "%~dp0backend"

echo Installing dependencies if needed...
call npm install

echo.
echo Running database migrations...
call npm run migrate

echo.
echo Starting backend server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
call npm run dev

pause
