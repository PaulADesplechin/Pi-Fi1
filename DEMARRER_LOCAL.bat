@echo off
title Pifi - Démarrage Local
color 0B

echo.
echo ============================================================
echo    Pifi - Démarrage Local
echo ============================================================
echo.

cd /d "%~dp0"

REM Vérifier Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe!
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js detecte
echo.

REM Créer .env si nécessaire
if not exist ".env" (
    echo [INFO] Creation du fichier .env...
    copy /Y env.example .env >nul 2>&1
    echo [OK] Fichier .env cree
    echo.
)

REM Installer dépendances frontend si nécessaire
if not exist "node_modules" (
    echo [INFO] Installation des dependances frontend...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERREUR] Echec de l'installation frontend
        pause
        exit /b 1
    )
    echo [OK] Dependances frontend installees
    echo.
)

REM Installer dépendances backend si nécessaire
if not exist "server\node_modules" (
    echo [INFO] Installation des dependances backend...
    cd server
    call npm install
    if %errorlevel% neq 0 (
        echo [ERREUR] Echec de l'installation backend
        pause
        exit /b 1
    )
    cd ..
    echo [OK] Dependances backend installees
    echo.
)

REM Arrêter les processus existants sur les ports 3000 et 3001
echo [INFO] Nettoyage des ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo [OK] Ports nettoyes
echo.

REM Démarrer backend
echo [INFO] Demarrage du serveur backend...
start "Pifi Backend" cmd /k "cd /d %~dp0server && npm start"
timeout /t 5 /nobreak >nul

REM Démarrer frontend
echo [INFO] Demarrage du frontend...
start "Pifi Frontend" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 10 /nobreak >nul

echo.
echo ============================================================
echo    Application demarree!
echo ============================================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Le navigateur va s'ouvrir automatiquement...
echo Fermez les fenetres cmd pour arreter les serveurs
echo.

REM Ouvrir le navigateur
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo Appuyez sur une touche pour fermer cette fenetre...
echo (Les serveurs continueront de tourner dans les fenetres cmd)
pause >nul

