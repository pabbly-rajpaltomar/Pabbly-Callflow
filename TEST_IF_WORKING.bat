@echo off
title CallFlow - System Test
color 0B

echo ========================================
echo    CallFlow System Test
echo ========================================
echo.

echo Testing Backend (port 5000)...
echo.
curl -s http://localhost:5000 > nul 2>&1
if errorlevel 1 (
    color 0C
    echo [X] Backend is NOT running on port 5000
    echo.
    echo SOLUTION: Run START_NOW.bat first
    echo.
) else (
    color 0A
    echo [OK] Backend is RUNNING on port 5000
    echo.
    curl http://localhost:5000
    echo.
)

echo.
echo Testing Frontend (port 3000)...
echo.
curl -s http://localhost:3000 > nul 2>&1
if errorlevel 1 (
    color 0C
    echo [X] Frontend is NOT running on port 3000
    echo.
    echo SOLUTION: Run START_NOW.bat first
    echo.
) else (
    color 0A
    echo [OK] Frontend is RUNNING on port 3000
    echo.
)

echo.
echo ========================================
echo    Test Complete
echo ========================================
echo.
echo If both show [OK], open browser to:
echo   http://localhost:3000
echo.
echo Login: admin@callflow.com / admin123
echo.
pause
