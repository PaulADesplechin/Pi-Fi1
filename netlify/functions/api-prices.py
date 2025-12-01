"""
Fonction Netlify simplifiée pour /api/prices
Version directe sans Flask pour éviter les problèmes
"""
import json
import requests
import os

COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

def handler(event, context):
    """Handler direct pour /api/prices"""
    try:
        # Mapping des tokens
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
            'LTC': {'symbol': 'LTC', 'name': 'Litecoin', 'id': 'litecoin'},
        }
        
        # Récupérer les prix depuis CoinGecko
        ids = ','.join([info['id'] for info in tokens_info.values()])
        url = f"{COINGECKO_API_URL}/simple/price"
        params = {
            'ids': ids,
            'vs_currencies': 'usd',
            'include_24hr_change': 'true',
            'include_24hr_vol': 'true'
        }
        
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            prices = []
            
            for symbol, info in tokens_info.items():
                coin_id = info['id']
                if coin_id in data:
                    coin_data = data[coin_id]
                    prices.append({
                        'symbol': symbol,
                        'name': info['name'],
                        'price': coin_data.get('usd', 0),
                        'change_24h': coin_data.get('usd_24h_change', 0),
                        'volume': 0
                    })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'prices': prices}, ensure_ascii=False)
            }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'error': 'Erreur API CoinGecko'}, ensure_ascii=False)
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'error': str(e)}, ensure_ascii=False)
        }

