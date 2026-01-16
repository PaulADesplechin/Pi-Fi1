@echo off
chcp 65001 >nul
title π-FI Dashboard - Démarrage Complet
color 0B

echo.
echo ============================================================
echo    π-FI Dashboard - Démarrage Complet
echo ============================================================
echo.

REM Arrêter processus existants
echo 🛑 Arrêt des processus Python existants...
taskkill /F /IM python.exe >nul 2>&1
timeout /t 1 /nobreak >nul

REM Vérifier Python
echo 🔍 Vérification de Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python non trouvé!
    echo.
    echo Veuillez installer Python depuis https://www.python.org/
    pause
    exit /b 1
)

REM Installer dépendances si nécessaire
echo 📦 Vérification des dépendances...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo 📦 Installation de Flask...
    python -m pip install flask requests --quiet
)

python -c "import requests" >nul 2>&1
if errorlevel 1 (
    echo 📦 Installation de Requests...
    python -m pip install requests --quiet
)

echo ✅ Configuration OK
echo.
echo 🚀 Démarrage du serveur...
echo.
echo 💡 Le dashboard sera disponible sur:
echo    http://localhost:5000
echo.
echo 💡 Le navigateur va s'ouvrir automatiquement
echo.
echo ⚠️  NE FERMEZ PAS CETTE FENÊTRE!
echo    Elle doit rester ouverte pour que le serveur fonctionne.
echo.
echo ============================================================
echo.

REM Lancer le serveur
python lancer.py

pause

