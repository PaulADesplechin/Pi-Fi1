@echo off
chcp 65001 >nul
title Pifi - Démarrage
color 0B

echo.
echo ============================================================
echo    Pifi - Application Alertes Crypto ^& Actions
echo ============================================================
echo.

REM Vérifier Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js non trouvé!
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js détecté
echo.

REM Vérifier les dépendances frontend
if not exist "node_modules" (
    echo 📦 Installation des dépendances frontend...
    call npm install
)

REM Vérifier les dépendances backend
if not exist "server\node_modules" (
    echo 📦 Installation des dépendances backend...
    cd server
    call npm install
    cd ..
)

echo.
echo 🚀 Démarrage du serveur backend...
start "Pifi Backend" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo.
echo 🚀 Démarrage du frontend...
start "Pifi Frontend" cmd /k "npm run dev"

echo.
echo ✅ Application démarrée!
echo.
echo 📊 Backend: http://localhost:3001
echo 🌐 Frontend: http://localhost:3000
echo.
echo 💡 Fermez les fenêtres pour arrêter les serveurs
echo.
pause

