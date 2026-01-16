# Script pour pousser le projet sur GitHub
# Usage: .\push-to-github.ps1

Write-Host "🚀 Configuration du push vers GitHub" -ForegroundColor Cyan
Write-Host ""

# Demander l'URL du repository GitHub
$repoUrl = Read-Host "Entrez l'URL de votre repository GitHub (ex: https://github.com/votre-username/projettelegram.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ URL invalide. Arrêt du script." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Ajout du remote GitHub..." -ForegroundColor Yellow

# Vérifier si un remote origin existe déjà
$existingRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "⚠️  Un remote 'origin' existe déjà: $existingRemote" -ForegroundColor Yellow
    $replace = Read-Host "Voulez-vous le remplacer? (o/n)"
    if ($replace -eq "o" -or $replace -eq "O") {
        git remote set-url origin $repoUrl
        Write-Host "✅ Remote mis à jour" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Utilisation du remote existant" -ForegroundColor Cyan
    }
} else {
    git remote add origin $repoUrl
    Write-Host "✅ Remote ajouté" -ForegroundColor Green
}

Write-Host ""
Write-Host "🌿 Vérification de la branche..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
Write-Host "Branche actuelle: $currentBranch" -ForegroundColor Cyan

Write-Host ""
Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow
Write-Host ""

# Essayer de pousser
git push -u origin $currentBranch

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Projet poussé avec succès sur GitHub!" -ForegroundColor Green
    Write-Host "🔗 Repository: $repoUrl" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors du push. Vérifiez:" -ForegroundColor Red
    Write-Host "   1. Que le repository existe sur GitHub" -ForegroundColor Yellow
    Write-Host "   2. Que vous avez les droits d'écriture" -ForegroundColor Yellow
    Write-Host "   3. Votre authentification GitHub (token ou SSH)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Pour créer le repository sur GitHub:" -ForegroundColor Cyan
    Write-Host "   1. Allez sur https://github.com/new" -ForegroundColor White
    Write-Host "   2. Nommez-le 'projettelegram' (ou autre)" -ForegroundColor White
    Write-Host "   3. Ne cochez PAS 'Initialize with README'" -ForegroundColor White
    Write-Host "   4. Créez le repository" -ForegroundColor White
    Write-Host "   5. Relancez ce script avec l'URL du nouveau repository" -ForegroundColor White
}

