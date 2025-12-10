@echo off
title Pifi - Démarrage Simple
color 0B

echo.
echo ============================================================
echo    Pifi - Démarrage Simple
echo ============================================================
echo.

cd /d "%~dp0"

echo 📦 Installation des dépendances (si nécessaire)...
if not exist "node_modules" (
    call npm install
)

if not exist "server\node_modules" (
    cd server
    call npm install
    cd ..
)

echo.
echo 🚀 Démarrage...
echo.

REM Démarrer backend
start "Pifi Backend" cmd /k "cd /d %~dp0server && npm start"

timeout /t 5 /nobreak >nul

REM Démarrer frontend
start "Pifi Frontend" cmd /k "cd /d %~dp0 && npm run dev"

timeout /t 8 /nobreak >nul

REM Ouvrir navigateur
start http://localhost:3000

echo ✅ Application démarrée sur http://localhost:3000
echo.
pause

