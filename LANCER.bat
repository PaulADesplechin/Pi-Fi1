@echo off
chcp 65001 >nul
title Pifi - Démarrage Local
color 0B

echo.
echo ============================================================
echo    Pifi - Démarrage Local
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

REM Aller dans le bon répertoire
cd /d "%~dp0"

REM Installer dépendances frontend si nécessaire
if not exist "node_modules" (
    echo 📦 Installation des dépendances frontend...
    call npm install
    if errorlevel 1 (
        echo ❌ Erreur lors de l'installation frontend
        pause
        exit /b 1
    )
)

REM Installer dépendances backend si nécessaire
if not exist "server\node_modules" (
    echo 📦 Installation des dépendances backend...
    cd server
    call npm install
    if errorlevel 1 (
        echo ❌ Erreur lors de l'installation backend
        pause
        exit /b 1
    )
    cd ..
)

echo.
echo ✅ Dépendances installées
echo.

REM Arrêter les processus existants sur les ports 3000 et 3001
echo 🧹 Nettoyage des ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

echo.
echo 🚀 Démarrage du serveur backend...
start "Pifi Backend" cmd /k "cd /d %~dp0server && npm start"

timeout /t 5 /nobreak >nul

echo.
echo 🚀 Démarrage du frontend...
start "Pifi Frontend" cmd /k "cd /d %~dp0 && npm run dev"

timeout /t 8 /nobreak >nul

echo.
echo ✅ Application démarrée!
echo.
echo 📊 Backend: http://localhost:3001
echo 🌐 Frontend: http://localhost:3000
echo.
echo 💡 Le navigateur va s'ouvrir automatiquement...
echo 💡 Fermez les fenêtres de commande pour arrêter les serveurs
echo.

REM Ouvrir le navigateur
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo ============================================================
echo    Application prête!
echo ============================================================
echo.
pause

