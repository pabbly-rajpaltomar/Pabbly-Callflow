@echo off
title Installing Twilio Package
color 0A

echo ========================================
echo    Installing Twilio Package
echo ========================================
echo.

cd /d "%~dp0backend"

echo Installing twilio package...
call npm install twilio

if errorlevel 1 (
    color 0C
    echo.
    echo [ERROR] Failed to install Twilio package!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Twilio Installed Successfully!
echo ========================================
echo.
echo Now restart your backend server:
echo 1. Close the backend command window (Ctrl+C)
echo 2. Double-click START_BACKEND.bat
echo.

pause
