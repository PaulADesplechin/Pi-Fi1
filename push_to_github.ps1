# Script pour pousser le projet vers GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PUSH VERS GITHUB - π-FI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
try {
    $gitVersion = git --version
    Write-Host "[OK] Git installe: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Git n'est pas installe!" -ForegroundColor Red
    exit 1
}

# Initialiser Git si nécessaire
if (-not (Test-Path .git)) {
    Write-Host "[INFO] Initialisation du depot Git..." -ForegroundColor Yellow
    git init
}

# Configurer le remote
Write-Host "[INFO] Configuration du remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin git@github.com:PaulADesplechin/Pi-Fi1.git
Write-Host "[OK] Remote configure: git@github.com:PaulADesplechin/Pi-Fi1.git" -ForegroundColor Green

# Afficher le remote
Write-Host ""
Write-Host "Remote configure:" -ForegroundColor Cyan
git remote -v

# Ajouter tous les fichiers
Write-Host ""
Write-Host "[INFO] Ajout des fichiers..." -ForegroundColor Yellow
git add .
$status = git status --short
if ($status) {
    Write-Host "[OK] Fichiers ajoutes:" -ForegroundColor Green
    $status | Select-Object -First 10 | ForEach-Object { Write-Host "  $_" }
    if (($status | Measure-Object).Count -gt 10) {
        Write-Host "  ... et autres fichiers" -ForegroundColor Gray
    }
} else {
    Write-Host "[INFO] Aucun changement a commiter" -ForegroundColor Yellow
}

# Commit
Write-Host ""
Write-Host "[INFO] Creation du commit..." -ForegroundColor Yellow
$commitMessage = "Initial commit: π-FI project - Bot Telegram + Dashboard Web"
git commit -m $commitMessage 2>&1 | ForEach-Object {
    if ($_ -match "nothing to commit") {
        Write-Host "[INFO] Rien a commiter (deja a jour)" -ForegroundColor Yellow
    } else {
        Write-Host $_
    }
}

# Créer la branche main si nécessaire
Write-Host ""
Write-Host "[INFO] Configuration de la branche main..." -ForegroundColor Yellow
git branch -M main 2>&1 | Out-Null

# Push
Write-Host ""
Write-Host "[INFO] Push vers GitHub..." -ForegroundColor Yellow
Write-Host "Repository: git@github.com:PaulADesplechin/Pi-Fi1.git" -ForegroundColor Cyan
Write-Host "Branche: main" -ForegroundColor Cyan
Write-Host ""

$pushOutput = git push -u origin main 2>&1
$pushOutput | ForEach-Object {
    Write-Host $_
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "[SUCCES] Push reussi!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository disponible sur:" -ForegroundColor Cyan
    Write-Host "https://github.com/PaulADesplechin/Pi-Fi1" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "[ERREUR] Le push a echoue" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifiez:" -ForegroundColor Yellow
    Write-Host "  1. Vos cles SSH sont configurees" -ForegroundColor Yellow
    Write-Host "  2. Vous avez les droits d'ecriture sur le repository" -ForegroundColor Yellow
    Write-Host "  3. La connexion Internet fonctionne" -ForegroundColor Yellow
}


