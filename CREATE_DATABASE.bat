@echo off
echo Creating database...
psql -U postgres -c "CREATE DATABASE callflow_db;"
echo.
echo Database created!
echo.
echo Now run FINAL_FIX.bat
pause
