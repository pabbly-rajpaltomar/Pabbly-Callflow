@echo off
echo ============================================
echo   DOWNLOAD LATEST CHANGES FROM GITHUB
echo ============================================
echo.
echo This will download any changes made from
echo another computer (office/home/laptop).
echo.
pause
echo.

echo Downloading latest code from GitHub...
git pull origin master
echo.

if %ERRORLEVEL% EQU 0 (
    echo ============================================
    echo   SUCCESS! Latest code downloaded!
    echo ============================================
    echo.
    echo Now you can start working with latest code.
    echo Run FINAL_FIX.bat if needed.
) else (
    echo ============================================
    echo   DOWNLOAD FAILED
    echo ============================================
    echo.
    echo Possible reasons:
    echo 1. No internet connection
    echo 2. Changes not pushed from other PC
    echo 3. Merge conflicts (you both edited same file)
)

echo.
pause
