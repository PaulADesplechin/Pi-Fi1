@echo off
chcp 65001 >nul
title π-FI Dashboard - Port 5000
color 0B

echo.
echo ============================================================
echo    π-FI Dashboard - Port 5000
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
echo 🚀 Démarrage du serveur sur le port 5000...
echo.
echo 💡 Le dashboard sera disponible sur:
echo    http://localhost:5000
echo.
echo ⚠️  NE FERMEZ PAS CETTE FENÊTRE!
echo.

REM Lancer le serveur sur le port 5000
python -c "import os; os.environ['PORT'] = '5000'; from dashboard import app; print('✅ Serveur démarré sur http://127.0.0.1:5000'); print('📊 Ouvrez: http://localhost:5000'); import webbrowser; import threading; import time; def open_browser(): time.sleep(2); webbrowser.open('http://localhost:5000'); threading.Thread(target=open_browser, daemon=True).start(); app.run(host='127.0.0.1', port=5000, debug=False, threaded=True, use_reloader=False)"

pause

