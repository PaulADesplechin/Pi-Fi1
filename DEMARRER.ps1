Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   Pifi - Application Alertes Crypto & Actions" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js non trouvé!" -ForegroundColor Red
    Write-Host "Veuillez installer Node.js depuis https://nodejs.org" -ForegroundColor Yellow
    pause
    exit 1
}

# Vérifier les dépendances frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Yellow
    npm install
}

# Vérifier les dépendances backend
if (-not (Test-Path "server\node_modules")) {
    Write-Host "📦 Installation des dépendances backend..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "🚀 Démarrage du serveur backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npm start"

Start-Sleep -Seconds 3

Write-Host "🚀 Démarrage du frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Write-Host ""
Write-Host "✅ Application démarrée!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Fermez les fenêtres pour arrêter les serveurs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Appuyez sur une touche pour ouvrir le navigateur..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:3000"

