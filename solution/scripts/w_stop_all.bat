@echo off
setlocal enabledelayedexpansion

REM --- Configuration ---
set SCRIPT_DIR=%~dp0..
set PID_DIR=%SCRIPT_DIR%\.pids
set LOG_DIR=%SCRIPT_DIR%\logs

REM Port Definitions
set PORT_UI=3000
set PORT_GATEWAY=3001
set PORT_MONGO=3002
set PORT_PGSQL=8080

echo 🛑 Stopping All Services...
echo.

REM Kill processes by port
for %%P in (%PORT_UI% %PORT_GATEWAY% %PORT_MONGO% %PORT_PGSQL%) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%P ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>&1
        if !errorlevel! equ 0 echo    ✓ Stopped service on port %%P
    )
)

REM Kill any remaining node processes
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM java.exe >nul 2>&1

REM Clean up PID directory (always)
if exist "%PID_DIR%\" (
    rmdir /s /q "%PID_DIR%"
)

echo.
set /p REPLY="Clear log files? (y/N): "
if /i "!REPLY!"=="y" (
    if exist "%LOG_DIR%\" (
        rmdir /s /q "%LOG_DIR%"
        echo    ✓ Logs directory removed
    )
)

echo.
echo ✅ Done

endlocal
