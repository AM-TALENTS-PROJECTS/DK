@echo off
cd /d "%~dp0"

echo.
echo  ================================
echo   Diamante K -- Serveur NestJS
echo  ================================
echo.

if not exist node_modules (
  echo  Installation des dependances Node...
  call npm install
  if errorlevel 1 (
    echo  Echec npm install.
    pause
    exit /b 1
  )
)

echo  Build TypeScript...
call npm run build > server.log 2>&1
if errorlevel 1 (
  echo  Echec du build. Voir server.log
  pause
  exit /b 1
)

echo  Demarrage du serveur...
powershell -NoProfile -Command "Start-Process -FilePath node -ArgumentList 'dist/main.js' -WorkingDirectory '%CD%' -WindowStyle Hidden"

timeout /t 2 /nobreak >nul

echo  Serveur demarre: http://localhost:5000
start http://localhost:5000
