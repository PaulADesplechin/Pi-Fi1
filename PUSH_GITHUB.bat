image.png@echo off
chcp 65001 >nul
echo ========================================
echo PUSH VERS GITHUB - π-FI
echo ========================================
echo.

REM Initialiser Git si nécessaire
if not exist .git (
    echo [INFO] Initialisation du depot Git...
    git init
)

REM Configurer le remote
echo [INFO] Configuration du remote...
git remote remove origin 2>nul
git remote add origin git@github.com:PaulADesplechin/Pi-Fi1.git
echo [OK] Remote configure
echo.
git remote -v
echo.

REM Ajouter les fichiers
echo [INFO] Ajout des fichiers...
git add .
echo [OK] Fichiers ajoutes
echo.

REM Commit
echo [INFO] Creation du commit...
git commit -m "Initial commit: π-FI project - Bot Telegram + Dashboard Web"
echo.

REM Branche main
echo [INFO] Configuration de la branche main...
git branch -M main
echo.

REM Push
echo [INFO] Push vers GitHub...
echo Repository: git@github.com:PaulADesplechin/Pi-Fi1.git
echo Branche: main
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo [SUCCES] Push reussi!
    echo ========================================
    echo.
    echo Repository disponible sur:
    echo https://github.com/PaulADesplechin/Pi-Fi1
) else (
    echo.
    echo ========================================
    echo [ERREUR] Le push a echoue
    echo ========================================
    echo.
    echo Verifiez:
    echo   1. Vos cles SSH sont configurees
    echo   2. Vous avez les droits d'ecriture sur le repository
    echo   3. La connexion Internet fonctionne
)

echo.
pause


