@echo off
setlocal

set PORT=%1
if "%PORT%"=="" set PORT=8000

echo Starting server on http://localhost:%PORT%
echo Press Ctrl+C to stop
echo.

REM Try Python 3
python -m http.server %PORT% 2>nul
if %errorlevel% equ 0 goto end

REM Try Python 2
python -m SimpleHTTPServer %PORT% 2>nul
if %errorlevel% equ 0 goto end

REM Try PowerShell as fallback
echo Python not found, using PowerShell...
powershell -ExecutionPolicy Bypass -File "%~dp0start-server.ps1" -Port %PORT%

:end
endlocal
