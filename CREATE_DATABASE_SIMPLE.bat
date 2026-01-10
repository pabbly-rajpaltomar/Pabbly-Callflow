@echo off
echo ================================================
echo Creating CallFlow Database
echo ================================================
echo.

cd "C:\Program Files\PostgreSQL\18\bin"

echo Creating database 'callflow_db'...
echo.

psql -U postgres -c "CREATE DATABASE callflow_db;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo SUCCESS! Database 'callflow_db' created!
    echo ================================================
) else (
    echo.
    echo ================================================
    echo Error creating database. Please check:
    echo 1. PostgreSQL is installed
    echo 2. You entered correct password
    echo ================================================
)

echo.
pause
