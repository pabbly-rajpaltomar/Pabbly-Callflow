@echo off
title CallFlow Quick Start
color 0B

echo.
echo     ╔══════════════════════════════════════════╗
echo     ║                                          ║
echo     ║          CALLFLOW QUICK START            ║
echo     ║                                          ║
echo     ╚══════════════════════════════════════════╝
echo.
echo.

echo This will start your CallFlow system.
echo.
echo Prerequisites (must be installed):
echo   ✓ Node.js
echo   ✓ PostgreSQL
echo.
echo If not installed, press Ctrl+C to cancel,
echo install them, then run this again.
echo.
pause

echo.
echo Starting installation and servers...
echo This will take 3-5 minutes on first run.
echo.
echo Please enter your PostgreSQL password when prompted.
echo (Usually "postgres" if you didn't change it)
echo.

:: Run the fix script
call "%~dp0FIX_CONNECTION_ERROR.bat"
