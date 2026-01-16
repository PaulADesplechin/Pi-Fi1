@echo off
chcp 65001 >nul
title π-FI Dashboard - Démarrage Propre
color 0B

echo.
echo ============================================================
echo    π-FI Dashboard - Nettoyage et Démarrage
echo ============================================================
echo.

echo 🧹 Nettoyage des processus Python...
taskkill /F /IM python.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo ✅ Nettoyage terminé
echo.

REM Vérifier Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python non trouvé!
    pause
    exit /b 1
)

echo 🚀 Démarrage du serveur...
echo.
echo 💡 Le dashboard sera disponible sur:
echo    http://localhost:5000 (PORT FIXE)
echo.
echo ⚠️  NE FERMEZ PAS CETTE FENÊTRE!
echo.

REM Lancer le serveur
python lancer.py

pause

