@echo off
setlocal enabledelayedexpansion

REM --- Configuration ---
set SCRIPT_DIR=%~dp0..
set LOG_DIR=%SCRIPT_DIR%\logs
set PID_DIR=%SCRIPT_DIR%\.pids

REM Port Definitions
set PORT_UI=3000
set PORT_GATEWAY=3001
set PORT_MONGO=3002
set PORT_PGSQL=8080

echo 🚀 Starting All Services...
echo.

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
if not exist "%PID_DIR%" mkdir "%PID_DIR%"

REM Check for port conflicts
set PORTS_IN_USE=0
for %%P in (%PORT_UI% %PORT_GATEWAY% %PORT_MONGO% %PORT_PGSQL%) do (
    netstat -ano | findstr :%%P | findstr LISTENING >nul 2>&1
    if !errorlevel! equ 0 (
        echo ⚠️  Port %%P is already in use
        set PORTS_IN_USE=1
    )
)

if !PORTS_IN_USE! equ 1 (
    echo.
    set /p REPLY="Stop existing services first? (Y/n): "
    if /i not "!REPLY!"=="n" (
        call "%SCRIPT_DIR%\scripts\stop_all.bat"
        timeout /t 2 /nobreak >nul
    ) else (
        exit /b 1
    )
)

REM Dependencies check
if not exist "%SCRIPT_DIR%\servers\frontend\express_ui\node_modules" (
    echo Installing UI dependencies...
    cd /d "%SCRIPT_DIR%\servers\frontend\express_ui"
    call npm install
)

if not exist "%SCRIPT_DIR%\servers\backend\express_gateway\node_modules" (
    echo Installing Gateway dependencies...
    cd /d "%SCRIPT_DIR%\servers\backend\express_gateway"
    call npm install
)

if not exist "%SCRIPT_DIR%\servers\backend\express_mongo\node_modules" (
    echo Installing Mongo dependencies...
    cd /d "%SCRIPT_DIR%\servers\backend\express_mongo"
    call npm install
)

REM Start Express UI
echo Starting Express UI...
cd /d "%SCRIPT_DIR%\servers\frontend\express_ui"
start /b cmd /c "npm start > %LOG_DIR%\ui.log 2>&1"
echo    ✓ URL: http://localhost:%PORT_UI%
echo    ✓ URL: http://localhost:%PORT_UI%/api-docs
timeout /t 2 /nobreak >nul

REM Start Express Gateway
echo Starting Express Gateway...
cd /d "%SCRIPT_DIR%\servers\backend\express_gateway"
start /b cmd /c "npm start > %LOG_DIR%\gateway.log 2>&1"
echo    ✓ URL: http://localhost:%PORT_GATEWAY%/api-docs
timeout /t 2 /nobreak >nul

REM Start Express Mongo
echo Starting Express Mongo...
cd /d "%SCRIPT_DIR%\servers\backend\express_mongo"
start /b cmd /c "npm start > %LOG_DIR%\mongo.log 2>&1"
echo    ✓ URL: http://localhost:%PORT_MONGO%/api-docs
timeout /t 2 /nobreak >nul

REM Start Spring Boot
echo Starting Spring Boot...
cd /d "%SCRIPT_DIR%\servers\backend\springboot_pgsql"
start /b cmd /c "gradlew.bat bootRun > %LOG_DIR%\pgsql.log 2>&1"
echo    ✓ URL: http://localhost:%PORT_PGSQL%/api-docs
timeout /t 4 /nobreak >nul

echo.
echo ✅ All services running!
echo 📂 Logs: %LOG_DIR%

cd /d "%SCRIPT_DIR%"
endlocal
