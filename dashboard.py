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
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
        }
        .stat-card h3 {
            color: #667eea;
            font-size: 0.9em;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .stat-card .value {
            font-size: 2.5em;
            font-weight: bold;
            color: #333;
        }
        .chart-container {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin-bottom: 30px;
        }
        .price-list {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .price-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        .price-item:last-child { border-bottom: none; }
        .price-item .symbol {
            font-weight: bold;
            font-size: 1.2em;
        }
        .price-item .price {
            font-size: 1.1em;
        }
        .change {
            padding: 5px 10px;
            border-radius: 5px;
            font-weight: bold;
        }
        .change.positive { background: #d4edda; color: #155724; }
        .change.negative { background: #f8d7da; color: #721c24; }
        .refresh-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            margin: 10px 0;
        }
        .refresh-btn:hover { background: #5568d3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 Bot Crypto Pro</h1>
            <p>Dashboard en temps réel</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <h3>Utilisateurs</h3>
                <div class="value" id="users-count">0</div>
            </div>
            <div class="stat-card">
                <h3>Alertes Actives</h3>
                <div class="value" id="alerts-count">0</div>
            </div>
            <div class="stat-card">
                <h3>Wallets Suivis</h3>
                <div class="value" id="wallets-count">0</div>
            </div>
            <div class="stat-card">
                <h3>Tokens Surveillés</h3>
                <div class="value" id="tokens-count">0</div>
            </div>
        </div>
        
        <div class="chart-container">
            <h2 style="margin-bottom: 20px;">📊 Prix Crypto (24h)</h2>
            <canvas id="priceChart"></canvas>
        </div>
        
        <div class="price-list">
            <h2 style="margin-bottom: 20px;">💰 Prix Principaux</h2>
            <button class="refresh-btn" onclick="refreshPrices()">🔄 Actualiser</button>
            <div id="prices-list"></div>
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
                    tension: 0.1
                }, {
                    label: 'ETH',
                    data: [],
                    borderColor: '#627eea',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: { beginAtZero: false }
                }
            }
        });
        
        async function loadData() {
            try {
                const response = await fetch('/api/data');
                const data = await response.json();
                
                document.getElementById('users-count').textContent = data.users_count || 0;
                document.getElementById('alerts-count').textContent = data.active_alerts || 0;
                document.getElementById('wallets-count').textContent = data.tracked_wallets || 0;
                document.getElementById('tokens-count').textContent = data.tracked_tokens || 0;
                
                // Mettre à jour les prix
                if (data.prices) {
                    updatePricesList(data.prices);
                }
                
                // Mettre à jour le graphique avec l'historique
                if (data.price_history) {
                    updateChart(data.price_history);
                }
            } catch (error) {
                console.error('Erreur chargement données:', error);
            }
        }
        
        function updateChart(priceHistory) {
            if (!priceHistory || !priceHistory.BTC || !priceHistory.ETH) return;
            
            // Préparer les données pour le graphique
            const btcData = priceHistory.BTC.map(item => item.price);
            const ethData = priceHistory.ETH.map(item => item.price);
            const labels = priceHistory.BTC.map((item, index) => {
                const date = new Date(item.timestamp);
                return date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
            });
            
            // Mettre à jour le graphique
            chart.data.labels = labels;
            chart.data.datasets[0].data = btcData;
            chart.data.datasets[1].data = ethData;
            chart.update('none'); // Mise à jour sans animation pour être plus rapide
        }
        
        function updatePricesList(prices) {
            const container = document.getElementById('prices-list');
            container.innerHTML = '';
            
            prices.forEach(token => {
                const changeClass = token.change_24h >= 0 ? 'positive' : 'negative';
                const changeSign = token.change_24h >= 0 ? '+' : '';
                
                const item = document.createElement('div');
                item.className = 'price-item';
                item.innerHTML = `
                    <div>
                        <div class="symbol">${token.symbol}</div>
                        <div style="font-size: 0.9em; color: #666;">${token.name}</div>
                    </div>
                    <div style="text-align: right;">
                        <div class="price">$${token.price.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        <div class="change ${changeClass}">${changeSign}${token.change_24h.toFixed(2)}%</div>
                    </div>
                `;
                container.appendChild(item);
            });
        }
        
        async function refreshPrices() {
            const response = await fetch('/api/prices');
            const data = await response.json();
            updatePricesList(data.prices || []);
        }
        
        // Charger les données au démarrage
        loadData();
        refreshPrices();
        
        // Actualiser toutes les 30 secondes
        setInterval(() => {
            loadData();
            refreshPrices();
        }, 30000);
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    """Page principale du dashboard"""
    return render_template_string(HTML_TEMPLATE)

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
            'DOT': 'DOTUSDT'
        }
        
        tokens_info = {
            'BTC': {'symbol': 'BTC', 'name': 'Bitcoin', 'id': 'bitcoin'},
            'ETH': {'symbol': 'ETH', 'name': 'Ethereum', 'id': 'ethereum'},
            'BNB': {'symbol': 'BNB', 'name': 'BNB', 'id': 'binancecoin'},
            'SOL': {'symbol': 'SOL', 'name': 'Solana', 'id': 'solana'},
            'ADA': {'symbol': 'ADA', 'name': 'Cardano', 'id': 'cardano'},
            'DOT': {'symbol': 'DOT', 'name': 'Polkadot', 'id': 'polkadot'}
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
    """Lance le serveur dashboard"""
    # Utiliser le port de Render ou 5000 par défaut
    if port is None:
        port = int(os.getenv('PORT', 5000))
    print(f"📊 Dashboard démarré sur http://{host}:{port}")
    app.run(host=host, port=port, debug=False)

if __name__ == '__main__':
    run_dashboard()

