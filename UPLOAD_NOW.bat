@echo off
echo ============================================
echo   UPLOADING CODE TO GITHUB
echo ============================================
echo.

echo Adding new files...
git add .
echo.

echo Creating save point...
git commit -m "Complete Pabbly Callflow with Pabbly UI and GitHub setup"
echo.

echo Uploading to GitHub...
echo Please enter your GitHub credentials when asked.
echo.
echo IMPORTANT: For password, use Personal Access Token
echo (Not your regular GitHub password)
echo.
git push -u origin master
echo.

if %ERRORLEVEL% EQU 0 (
    echo ============================================
    echo   SUCCESS! CODE UPLOADED TO GITHUB!
    echo ============================================
    echo.
    echo You can now see your code at:
    echo https://github.com/pabbly-rajpaltomar/Pabbly-Callflow
) else (
    echo ============================================
    echo   UPLOAD FAILED
    echo ============================================
    echo.
    echo Possible reasons:
    echo 1. Repository doesn't exist on GitHub
    echo 2. Wrong username/password
    echo 3. Need to use Personal Access Token
    echo.
    echo See GITHUB_SETUP_GUIDE.txt for help
)

echo.
pause
