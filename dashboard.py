"""
Dashboard Web pour le Bot Crypto Pro
Interface web pour visualiser les données crypto
"""
from flask import Flask, render_template_string, jsonify
from datetime import datetime
import requests
import os
from shared_data import shared_data, get_stats

app = Flask(__name__)

COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'
BINANCE_API_URL = 'https://api.binance.com/api/v3'

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bot Crypto Pro - Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        :root {
            --bg-primary: #0a0e27;
            --bg-secondary: #141b2d;
            --bg-card: #1a2332;
            --accent-primary: #667eea;
            --accent-secondary: #764ba2;
            --text-primary: #ffffff;
            --text-secondary: #a0aec0;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-primary);
            background-image: 
                radial-gradient(at 0% 0%, rgba(102, 126, 234, 0.15) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(118, 75, 162, 0.15) 0px, transparent 50%);
            min-height: 100vh;
            padding: 20px;
            color: var(--text-primary);
            animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            animation: slideUp 0.6s ease-out;
        }
        
        .header h1 { 
            font-size: 3em; 
            margin-bottom: 10px;
            background: var(--gradient-1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 800;
            letter-spacing: -1px;
        }
        
        .header p {
            color: var(--text-secondary);
            font-size: 1.1em;
            font-weight: 300;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: var(--bg-card);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            animation: slideUp 0.6s ease-out;
            animation-fill-mode: both;
        }
        
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
            border-color: rgba(102, 126, 234, 0.3);
        }
        
        .stat-card:hover::before {
            left: 100%;
        }
        
        .stat-card .icon {
            font-size: 2.5em;
            margin-bottom: 15px;
            background: var(--gradient-1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .stat-card h3 {
            color: var(--text-secondary);
            font-size: 0.85em;
            text-transform: uppercase;
            margin-bottom: 15px;
            letter-spacing: 1px;
            font-weight: 600;
        }
        
        .stat-card .value {
            font-size: 3em;
            font-weight: 800;
            color: var(--text-primary);
            transition: all 0.3s ease;
            font-variant-numeric: tabular-nums;
        }
        
        .stat-card .value.updating {
            animation: pulse 0.5s ease-in-out;
        }
        
        .chart-container {
            background: var(--bg-card);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            animation: slideUp 0.8s ease-out;
        }
        
        .chart-container h2 {
            margin-bottom: 25px;
            font-size: 1.5em;
            font-weight: 700;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .price-list {
            background: var(--bg-card);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.05);
            animation: slideUp 1s ease-out;
        }
        
        .price-list h2 {
            margin-bottom: 25px;
            font-size: 1.5em;
            font-weight: 700;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .price-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
            border-radius: 12px;
            margin-bottom: 8px;
        }
        
        .price-item:hover {
            background: rgba(102, 126, 234, 0.1);
            transform: translateX(5px);
        }
        
        .price-item:last-child { border-bottom: none; }
        
        .price-item .symbol {
            font-weight: 700;
            font-size: 1.3em;
            color: var(--text-primary);
        }
        
        .price-item .name {
            font-size: 0.9em;
            color: var(--text-secondary);
            margin-top: 4px;
        }
        
        .price-item .price {
            font-size: 1.2em;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 5px;
        }
        
        .change {
            padding: 6px 12px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9em;
            transition: all 0.3s ease;
        }
        
        .change.positive { 
            background: rgba(16, 185, 129, 0.2);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .change.negative { 
            background: rgba(239, 68, 68, 0.2);
            color: var(--danger);
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .refresh-btn {
            background: var(--gradient-1);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 1em;
            font-weight: 600;
            margin: 10px 0 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .refresh-btn:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        
        .refresh-btn:active {
            transform: translateY(0);
        }
        
        .refresh-btn i {
            margin-right: 8px;
            animation: spin 2s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
        
        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--success);
            margin-right: 8px;
            animation: pulse 2s ease-in-out infinite;
        }
        
        .last-update {
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.85em;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-robot"></i> Bot Crypto Pro</h1>
            <p><span class="status-indicator"></span>Dashboard en temps réel</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="icon"><i class="fas fa-users"></i></div>
                <h3>Utilisateurs</h3>
                <div class="value" id="users-count">0</div>
            </div>
            <div class="stat-card">
                <div class="icon"><i class="fas fa-bell"></i></div>
                <h3>Alertes Actives</h3>
                <div class="value" id="alerts-count">0</div>
            </div>
            <div class="stat-card">
                <div class="icon"><i class="fas fa-wallet"></i></div>
                <h3>Wallets Suivis</h3>
                <div class="value" id="wallets-count">0</div>
            </div>
            <div class="stat-card">
                <div class="icon"><i class="fas fa-coins"></i></div>
                <h3>Tokens Surveillés</h3>
                <div class="value" id="tokens-count">0</div>
            </div>
        </div>
        
        <div class="chart-container">
            <h2><i class="fas fa-chart-line"></i> Prix Crypto (24h)</h2>
            <canvas id="priceChart"></canvas>
        </div>
        
        <div class="price-list">
            <h2><i class="fas fa-dollar-sign"></i> Prix Principaux</h2>
            <button class="refresh-btn" onclick="refreshPrices()"><i class="fas fa-sync-alt"></i> Actualiser</button>
            <div id="prices-list"></div>
            <div class="last-update" id="last-update">Dernière mise à jour: --</div>
        </div>
    </div>
    
    <script>
        const ctx = document.getElementById('priceChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'BTC',
                    data: [],
                    borderColor: '#f7931a',
                    backgroundColor: 'rgba(247, 147, 26, 0.15)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#f7931a',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }, {
                    label: 'ETH',
                    data: [],
                    borderColor: '#627eea',
                    backgroundColor: 'rgba(98, 126, 234, 0.15)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#627eea',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }, {
                    label: 'SOL',
                    data: [],
                    borderColor: '#9945ff',
                    backgroundColor: 'rgba(153, 69, 255, 0.15)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#9945ff',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }, {
                    label: 'BNB',
                    data: [],
                    borderColor: '#f3ba2f',
                    backgroundColor: 'rgba(243, 186, 47, 0.15)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#f3ba2f',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: { 
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#a0aec0',
                            font: {
                                family: 'Inter',
                                size: 12,
                                weight: '600'
                            },
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(26, 35, 50, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#a0aec0',
                        borderColor: 'rgba(102, 126, 234, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                            }
                        }
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a0aec0',
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            callback: function(value) {
                                return '$' + value.toLocaleString('fr-FR', {minimumFractionDigits: 0, maximumFractionDigits: 0});
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#a0aec0',
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            maxTicksLimit: 10
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
        
        function animateValue(element, start, end, duration) {
            const startTime = performance.now();
            const startValue = parseInt(element.textContent) || 0;
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(startValue + (end - startValue) * progress);
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        }
        
        function updateLastUpdateTime() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
            document.getElementById('last-update').textContent = `Dernière mise à jour: ${timeStr}`;
        }
        
        async function loadData() {
            try {
                const response = await fetch('/api/data');
                const data = await response.json();
                
                // Animer les valeurs
                const usersEl = document.getElementById('users-count');
                const alertsEl = document.getElementById('alerts-count');
                const walletsEl = document.getElementById('wallets-count');
                const tokensEl = document.getElementById('tokens-count');
                
                animateValue(usersEl, parseInt(usersEl.textContent) || 0, data.users_count || 0, 500);
                animateValue(alertsEl, parseInt(alertsEl.textContent) || 0, data.active_alerts || 0, 500);
                animateValue(walletsEl, parseInt(walletsEl.textContent) || 0, data.tracked_wallets || 0, 500);
                animateValue(tokensEl, parseInt(tokensEl.textContent) || 0, data.tracked_tokens || 0, 500);
                
                // Mettre à jour les prix
                if (data.prices) {
                    updatePricesList(data.prices);
                }
                
                // Mettre à jour le graphique avec l'historique
                if (data.price_history) {
                    updateChart(data.price_history);
                }
                
                updateLastUpdateTime();
            } catch (error) {
                console.error('Erreur chargement données:', error);
            }
        }
        
        function updateChart(priceHistory) {
            if (!priceHistory) return;
            
            // Trouver le dataset le plus long pour les labels
            const datasets = ['BTC', 'ETH', 'SOL', 'BNB'];
            let maxLength = 0;
            let longestDataset = null;
            
            datasets.forEach(symbol => {
                if (priceHistory[symbol] && priceHistory[symbol].length > maxLength) {
                    maxLength = priceHistory[symbol].length;
                    longestDataset = symbol;
                }
            });
            
            if (!longestDataset) return;
            
            // Préparer les labels depuis le dataset le plus long
            const labels = priceHistory[longestDataset].map((item) => {
                const date = new Date(item.timestamp);
                return date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
            });
            
            // Préparer les données pour chaque crypto
            const btcData = priceHistory.BTC ? priceHistory.BTC.map(item => item.price) : [];
            const ethData = priceHistory.ETH ? priceHistory.ETH.map(item => item.price) : [];
            const solData = priceHistory.SOL ? priceHistory.SOL.map(item => item.price) : [];
            const bnbData = priceHistory.BNB ? priceHistory.BNB.map(item => item.price) : [];
            
            // Mettre à jour le graphique
            chart.data.labels = labels;
            chart.data.datasets[0].data = btcData;
            chart.data.datasets[1].data = ethData;
            chart.data.datasets[2].data = solData;
            chart.data.datasets[3].data = bnbData;
            chart.update('none'); // Mise à jour sans animation pour être plus rapide
        }
        
        function updatePricesList(prices) {
            const container = document.getElementById('prices-list');
            container.innerHTML = '';
            
            if (prices.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 40px;">Aucun prix disponible</div>';
                return;
            }
            
            prices.forEach((token, index) => {
                const changeClass = token.change_24h >= 0 ? 'positive' : 'negative';
                const changeSign = token.change_24h >= 0 ? '+' : '';
                const changeIcon = token.change_24h >= 0 ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>';
                
                const item = document.createElement('div');
                item.className = 'price-item';
                item.style.animationDelay = `${index * 0.05}s`;
                item.style.animation = 'slideUp 0.5s ease-out';
                item.style.animationFillMode = 'both';
                item.innerHTML = `
                    <div>
                        <div class="symbol">${token.symbol}</div>
                        <div class="name">${token.name}</div>
                    </div>
                    <div style="text-align: right;">
                        <div class="price">$${token.price.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        <div class="change ${changeClass}">${changeIcon} ${changeSign}${token.change_24h.toFixed(2)}%</div>
                    </div>
                `;
                container.appendChild(item);
            });
        }
        
        async function refreshPrices() {
            const btn = event?.target || document.querySelector('.refresh-btn');
            const icon = btn.querySelector('i');
            
            if (icon) {
                icon.style.animation = 'spin 1s linear infinite';
            }
            
            try {
                const response = await fetch('/api/prices');
                const data = await response.json();
                updatePricesList(data.prices || []);
                updateLastUpdateTime();
            } catch (error) {
                console.error('Erreur actualisation prix:', error);
            } finally {
                if (icon) {
                    setTimeout(() => {
                        icon.style.animation = '';
                    }, 1000);
                }
            }
        }
        
        // Charger les données au démarrage
        loadData();
        refreshPrices();
        
        // Actualiser toutes les 30 secondes
        setInterval(() => {
            loadData();
            refreshPrices();
        }, 30000);
        
        // Mettre à jour l'heure toutes les secondes
        setInterval(updateLastUpdateTime, 1000);
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    """Page principale du dashboard"""
    return render_template_string(HTML_TEMPLATE)

@app.route('/dashboard')
def dashboard_redirect():
    """Redirection pour compatibilité avec l'ancienne URL"""
    return render_template_string(HTML_TEMPLATE)

@app.route('/health')
def health():
    """Endpoint de santé pour vérifier que le serveur fonctionne"""
    return jsonify({'status': 'ok', 'service': 'dashboard'})

@app.route('/api/data')
def api_data():
    """API pour récupérer les données du dashboard"""
    stats = get_stats()
    return jsonify({
        'users_count': stats['users_count'],
        'active_alerts': stats['active_alerts'],
        'tracked_wallets': stats['tracked_wallets'],
        'tracked_tokens': stats['tracked_tokens'],
        'price_history': shared_data['price_history']
    })

@app.route('/api/prices')
def api_prices():
    """API pour récupérer les prix crypto (Binance en priorité, CoinGecko en fallback)"""
    try:
        prices = []
        
        # Mapping des tokens vers leurs symboles Binance
        binance_tokens = {
            'BTC': 'BTCUSDT',
            'ETH': 'ETHUSDT',
            'BNB': 'BNBUSDT',
            'SOL': 'SOLUSDT',
            'ADA': 'ADAUSDT',
            'DOT': 'DOTUSDT',
            'MATIC': 'MATICUSDT',
            'AVAX': 'AVAXUSDT',
            'LINK': 'LINKUSDT',
            'XRP': 'XRPUSDT',
            'DOGE': 'DOGEUSDT',
            'LTC': 'LTCUSDT'
        }
        
        tokens_info = {
            'BTC': {'symbol': 'BTC', 'name': 'Bitcoin', 'id': 'bitcoin'},
            'ETH': {'symbol': 'ETH', 'name': 'Ethereum', 'id': 'ethereum'},
            'BNB': {'symbol': 'BNB', 'name': 'BNB', 'id': 'binancecoin'},
            'SOL': {'symbol': 'SOL', 'name': 'Solana', 'id': 'solana'},
            'ADA': {'symbol': 'ADA', 'name': 'Cardano', 'id': 'cardano'},
            'DOT': {'symbol': 'DOT', 'name': 'Polkadot', 'id': 'polkadot'},
            'MATIC': {'symbol': 'MATIC', 'name': 'Polygon', 'id': 'matic-network'},
            'AVAX': {'symbol': 'AVAX', 'name': 'Avalanche', 'id': 'avalanche-2'},
            'LINK': {'symbol': 'LINK', 'name': 'Chainlink', 'id': 'chainlink'},
            'XRP': {'symbol': 'XRP', 'name': 'Ripple', 'id': 'ripple'},
            'DOGE': {'symbol': 'DOGE', 'name': 'Dogecoin', 'id': 'dogecoin'},
            'LTC': {'symbol': 'LTC', 'name': 'Litecoin', 'id': 'litecoin'}
        }
        
        # Essayer Binance d'abord pour les tokens principaux
        for symbol, info in tokens_info.items():
            if symbol in binance_tokens:
                try:
                    url = f"{BINANCE_API_URL}/ticker/24hr"
                    params = {'symbol': binance_tokens[symbol]}
                    response = requests.get(url, params=params, timeout=5)
                    if response.status_code == 200:
                        data = response.json()
                        prices.append({
                            'symbol': info['symbol'],
                            'name': info['name'],
                            'price': float(data['lastPrice']),
                            'change_24h': float(data['priceChangePercent'])
                        })
                        continue
                except:
                    pass
            
            # Fallback sur CoinGecko
            try:
                url = f"{COINGECKO_API_URL}/simple/price"
                params = {
                    'ids': info['id'],
                    'vs_currencies': 'usd',
                    'include_24hr_change': 'true'
                }
                response = requests.get(url, params=params, timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    if info['id'] in data:
                        prices.append({
                            'symbol': info['symbol'],
                            'name': info['name'],
                            'price': data[info['id']]['usd'],
                            'change_24h': data[info['id']].get('usd_24h_change', 0)
                        })
            except:
                pass
        
        return jsonify({'prices': prices})
    except Exception as e:
        return jsonify({'error': str(e), 'prices': []}), 500

def run_dashboard(host='0.0.0.0', port=None):
    """Lance le serveur dashboard (utilisé pour le développement local)"""
    # Utiliser le port de Render ou 5000 par défaut
    if port is None:
        port = int(os.getenv('PORT', 5000))
    print(f"📊 Dashboard démarré sur http://{host}:{port}")
    app.run(host=host, port=port, debug=False, threaded=True)

if __name__ == '__main__':
    run_dashboard()

