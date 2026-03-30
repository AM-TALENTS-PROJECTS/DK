@echo off
title Diamanté K — Arrêt serveur
cd /d "%~dp0"

set "PORT=5000"

echo.
echo  Arret du serveur NestJS...

set "KILLED=0"
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%PORT%"') do (
    taskkill /PID %%a /F >nul 2>&1
    if not errorlevel 1 set "KILLED=1"
)

if "%KILLED%"=="0" (
    echo  Aucun serveur detecte sur le port %PORT%.
) else (
    echo  Serveur arrete sur le port %PORT%.
)

echo.
timeout /t 2 /nobreak >nul
