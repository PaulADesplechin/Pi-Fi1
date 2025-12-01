@echo off
chcp 65001 >nul
title π-FI Dashboard
color 0B

echo.
echo ============================================================
echo    π-FI Dashboard - Démarrage
echo ============================================================
echo.

REM Arrêter processus existants
taskkill /F /IM python.exe >nul 2>&1
timeout /t 1 /nobreak >nul

REM Vérifier Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python non trouvé!
    pause
    exit /b 1
)

REM Installer dépendances si nécessaire
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo 📦 Installation des dépendances...
    python -m pip install flask requests python-dotenv --quiet
)

echo ✅ Configuration OK
echo.
echo 🚀 Démarrage du serveur...
echo.

REM Lancer le serveur
python lancer.py

pause

