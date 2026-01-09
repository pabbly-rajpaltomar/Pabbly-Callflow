@echo off
echo ============================================
echo   PUSH CODE TO GITHUB
echo ============================================
echo.

echo Step 1: Adding all files to git...
git add .
echo.

echo Step 2: Creating a save point (commit)...
git commit -m "Updated Pabbly Callflow code - %date% %time%"
echo.

echo Step 3: Pushing to GitHub...
git push origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ============================================
    echo   SUCCESS! Code uploaded to GitHub!
    echo ============================================
) else (
    echo ============================================
    echo   PUSH FAILED!
    echo   Please check the error message above
    echo ============================================
)

echo.
pause
