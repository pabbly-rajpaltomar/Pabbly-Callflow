@echo off
echo ======================================
echo Starting CallFlow Web Dashboard
echo ======================================
echo.

cd /d "%~dp0frontend"

echo Installing dependencies if needed...
call npm install

echo.
echo Starting web dashboard on http://localhost:3000
echo Browser will open automatically
echo Press Ctrl+C to stop the server
echo.
call npm run dev

pause
