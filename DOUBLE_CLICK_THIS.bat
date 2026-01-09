@echo off
title CallFlow - Auto Start
color 0A

echo ========================================
echo    Starting CallFlow System
echo ========================================
echo.
echo This will start both servers automatically.
echo Two windows will open - keep them open!
echo.
pause

PowerShell -ExecutionPolicy Bypass -File "%~dp0START_EVERYTHING.ps1"
