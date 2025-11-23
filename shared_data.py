"""
Module partagé pour stocker les données entre le bot Telegram et le dashboard web
"""
from typing import Dict, Set
from datetime import datetime

# Données partagées entre le bot et le dashboard
shared_data = {
    # Utilisateurs
    'users': set(),  # {user_id}
    
    # Alertes
    'alert_subscribers': {},  # {token_id: {user_id}}
    
    # Wallets
    'tracked_wallets': {},  # {user_id: {wallet_address}}
    
    # Tokens surveillés
    'tracked_tokens': {},  # {user_id: {token_id: last_price}}
    
    # Historique des prix pour le graphique
    'price_history': {
        'BTC': [],
        'ETH': []
    },
    
    # Dernière mise à jour
    'last_update': datetime.now()
}

def get_stats() -> Dict:
    """Retourne les statistiques pour le dashboard"""
    users_count = len(shared_data['users'])
    
    # Compter les alertes actives (tokens avec au moins un abonné)
    active_alerts = len([
        token_id for token_id, subscribers in shared_data['alert_subscribers'].items()
        if len(subscribers) > 0
    ])
    
    # Compter les wallets suivis
    tracked_wallets_count = sum(
        len(wallets) for wallets in shared_data['tracked_wallets'].values()
    )
    
    # Compter les tokens surveillés
    tracked_tokens_count = sum(
        len(tokens) for tokens in shared_data['tracked_tokens'].values()
    )
    
    return {
        'users_count': users_count,
        'active_alerts': active_alerts,
        'tracked_wallets': tracked_wallets_count,
        'tracked_tokens': tracked_tokens_count
    }

def add_user(user_id: int):
    """Ajoute un utilisateur"""
    shared_data['users'].add(user_id)
    shared_data['last_update'] = datetime.now()

def add_alert(user_id: int, token_id: str):
    """Ajoute une alerte"""
    if token_id not in shared_data['alert_subscribers']:
        shared_data['alert_subscribers'][token_id] = set()
    shared_data['alert_subscribers'][token_id].add(user_id)
    shared_data['last_update'] = datetime.now()

def remove_alert(user_id: int, token_id: str):
    """Retire une alerte"""
    if token_id in shared_data['alert_subscribers']:
        shared_data['alert_subscribers'][token_id].discard(user_id)
        if not shared_data['alert_subscribers'][token_id]:
            del shared_data['alert_subscribers'][token_id]
    shared_data['last_update'] = datetime.now()

def add_wallet(user_id: int, wallet_address: str):
    """Ajoute un wallet"""
    if user_id not in shared_data['tracked_wallets']:
        shared_data['tracked_wallets'][user_id] = set()
    shared_data['tracked_wallets'][user_id].add(wallet_address)
    shared_data['last_update'] = datetime.now()

def add_price_to_history(symbol: str, price: float):
    """Ajoute un prix à l'historique pour le graphique"""
    if symbol in shared_data['price_history']:
        history = shared_data['price_history'][symbol]
        history.append({
            'timestamp': datetime.now().isoformat(),
            'price': price
        })
        # Garder seulement les 24 dernières heures (144 points si mise à jour toutes les 10 minutes)
        if len(history) > 144:
            history.pop(0)

