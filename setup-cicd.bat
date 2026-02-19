@echo off
chcp 65001 >nul
echo.
echo  Running CI/CD setup script...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-cicd.ps1"
echo.
pause
