@echo off
echo ============================================
echo   CHECKING GITHUB STATUS
echo ============================================
echo.

echo Checking Git configuration...
git config user.name >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git not configured
    echo Please run FIRST_TIME_GITHUB_SETUP.bat
    goto :end
)
echo ✓ Git is configured
echo   Name:
git config user.name
echo   Email:
git config user.email
echo.

echo Checking GitHub repository connection...
git remote -v | findstr "origin" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ No GitHub repository connected
    goto :end
)
echo ✓ Connected to GitHub repository:
git remote get-url origin
echo.

echo Checking if code is committed...
git log -1 --oneline >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ No commits yet
    goto :end
)
echo ✓ Latest commit:
git log -1 --oneline
echo.

echo Checking if code is pushed to GitHub...
git ls-remote origin master >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ CODE NOT ON GITHUB YET
    echo.
    echo Your code is saved locally but not uploaded.
    echo To upload: Double-click UPLOAD_NOW.bat
    goto :end
)
echo ✓ CODE IS ON GITHUB!
echo.
echo Your code URL:
git remote get-url origin
echo.

echo Checking for unpushed changes...
git status --short
echo.

:end
echo ============================================
pause
