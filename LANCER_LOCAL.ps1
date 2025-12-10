# Script PowerShell pour démarrer Pifi localement
$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   Pifi - Démarrage Local" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js non trouvé!" -ForegroundColor Red
    Write-Host "Veuillez installer Node.js depuis https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# Aller dans le répertoire du script
Set-Location $PSScriptRoot

# Créer .env si nécessaire
if (-not (Test-Path ".env")) {
    Write-Host "📝 Création du fichier .env..." -ForegroundColor Yellow
    @"
NEXT_PUBLIC_API_URL=http://localhost:3001
SERVER_PORT=3001
JWT_SECRET=pifi-secret-key-change-in-production-2024
OPENAI_API_KEY=
COINGECKO_API_KEY=
"@ | Out-File -FilePath ".env" -Encoding UTF8
}

# Installer dépendances frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Yellow
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation frontend" -ForegroundColor Red
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
}

# Installer dépendances backend
if (-not (Test-Path "server\node_modules")) {
    Write-Host "📦 Installation des dépendances backend..." -ForegroundColor Yellow
    Set-Location server
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation backend" -ForegroundColor Red
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
    Set-Location ..
}

Write-Host ""
Write-Host "✅ Dépendances installées" -ForegroundColor Green
Write-Host ""

# Arrêter les processus existants
Write-Host "🧹 Nettoyage des ports..." -ForegroundColor Yellow
$ports = @(3000, 3001)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq "Listen" }
    foreach ($conn in $connections) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "🚀 Démarrage du serveur backend..." -ForegroundColor Green
$backendPath = Join-Path $PSScriptRoot "server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 5

Write-Host "🚀 Démarrage du frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 8

Write-Host ""
Write-Host "✅ Application démarrée!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Le navigateur va s'ouvrir automatiquement..." -ForegroundColor Yellow
Write-Host "💡 Fermez les fenêtres PowerShell pour arrêter les serveurs" -ForegroundColor Yellow
Write-Host ""

# Ouvrir le navigateur
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "    Application prête!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Entrée pour fermer cette fenêtre (les serveurs continueront de tourner)..."
Read-Host

