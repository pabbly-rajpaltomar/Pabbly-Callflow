@echo off
echo ============================================
echo   FIRST TIME GITHUB SETUP
echo ============================================
echo.
echo This will prepare your code to upload to GitHub.
echo.
echo IMPORTANT: Before running this:
echo 1. Create a GitHub account at https://github.com
echo 2. Create a new repository called "Pabbly-Callflow"
echo 3. Keep it PRIVATE
echo.
pause
echo.

echo Please enter your information:
echo.
set /p NAME="Your Name: "
set /p EMAIL="Your Email (same as GitHub): "
echo.

echo Setting up Git with your information...
git config --global user.name "%NAME%"
git config --global user.email "%EMAIL%"
echo Done!
echo.

echo Creating first save point (commit)...
git commit -m "Initial commit - Pabbly Callflow project with Pabbly UI"
echo.

echo ============================================
echo   ALMOST DONE!
echo ============================================
echo.
echo Next steps:
echo.
echo 1. Go to your GitHub repository page
echo    (https://github.com/YOUR-USERNAME/Pabbly-Callflow)
echo.
echo 2. Copy the repository URL (it looks like):
echo    https://github.com/YOUR-USERNAME/Pabbly-Callflow.git
echo.
set /p REPO_URL="Paste the repository URL here: "
echo.

echo Connecting to GitHub...
git remote add origin %REPO_URL%
echo.

echo Uploading code to GitHub...
git push -u origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ============================================
    echo   SUCCESS!
    echo   Your code is now on GitHub!
    echo ============================================
    echo.
    echo From now on, just use PUSH_TO_GITHUB.bat
    echo to upload any changes.
) else (
    echo ============================================
    echo   UPLOAD FAILED
    echo ============================================
    echo.
    echo You may need to create a Personal Access Token.
    echo See GITHUB_SETUP_GUIDE.txt for instructions.
)

echo.
pause
