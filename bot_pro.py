"""
Bot Telegram Crypto Pro - Version améliorée
Fonctionnalités: Alertes multi-tokens, Sniper, Rugpull detection, Wallet tracking, Dashboard web
"""
import os
import asyncio
import re
from datetime import datetime, timedelta
import time
from typing import Dict, List, Optional, Set
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler, 
    ContextTypes, MessageHandler, filters
)
from telegram.constants import ParseMode
import requests as sync_requests
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
ETHERSCAN_API_KEY = os.getenv('ETHERSCAN_API_KEY', '')
COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'
DEXSCREENER_API_URL = 'https://api.dexscreener.com/latest/dex'

# Stockage en mémoire (en production, utiliser une base de données)
user_settings: Dict[int, Dict] = {}  # {user_id: {settings}}
tracked_tokens: Dict[int, Dict[str, float]] = {}  # {user_id: {token_id: last_price}}
tracked_wallets: Dict[int, Set[str]] = {}  # {user_id: {wallet_addresses}}
sniper_tokens: Dict[int, Dict] = {}  # {user_id: {filters}}
alert_subscribers: Dict[str, Set[int]] = {  # {token: {user_ids}}
    'ethereum': set(),
    'bitcoin': set(),
}

# Cache pour éviter trop d'appels API
price_cache: Dict[str, tuple] = {}  # {token_id: (price, timestamp)}
CACHE_DURATION = 60  # secondes (augmenté pour réduire les requêtes)
last_api_call = None
MIN_API_INTERVAL = 1.5  # secondes minimum entre les appels API (rate limiting CoinGecko)

class SecurityValidator:
    """Classe pour valider et sécuriser les entrées utilisateur"""
    
    @staticmethod
    def validate_ethereum_address(address: str) -> bool:
        """Valide une adresse Ethereum"""
        if not address or not isinstance(address, str):
            return False
        pattern = r'^0x[a-fA-F0-9]{40}$'
        return bool(re.match(pattern, address))
    
    @staticmethod
    def sanitize_input(text: str, max_length: int = 100) -> Optional[str]:
        """Nettoie et valide une entrée texte"""
        if not text or not isinstance(text, str):
            return None
        # Supprimer les caractères dangereux
        text = re.sub(r'[<>{}[\]\\]', '', text)
        return text[:max_length] if len(text) <= max_length else None
    
    @staticmethod
    def validate_token_id(token_id: str) -> bool:
        """Valide un ID de token"""
        if not token_id or not isinstance(token_id, str):
            return False
        # Token ID doit être alphanumérique avec tirets/underscores
        pattern = r'^[a-zA-Z0-9_-]+$'
        return bool(re.match(pattern, token_id)) and len(token_id) <= 50

class CryptoAPI:
    """Classe pour les appels API crypto"""
    
    def __init__(self):
        # Utiliser requests directement (plus fiable)
        pass
    
    async def get_price(self, token_id: str) -> Optional[tuple]:
        """Récupère le prix d'un token depuis CoinGecko (avec cache)"""
        token_id = token_id.lower()
        
        # Mapping des noms communs vers les IDs CoinGecko
        token_mapping = {
            'btc': 'bitcoin',
            'eth': 'ethereum',
            'bnb': 'binancecoin',
            'sol': 'solana',
            'ada': 'cardano',
            'dot': 'polkadot',
            'matic': 'matic-network',
            'avax': 'avalanche-2',
            'link': 'chainlink',
            'xrp': 'ripple'
        }
        
        # Utiliser le mapping si disponible
        coin_id = token_mapping.get(token_id, token_id)
        
        # Vérifier le cache
        if coin_id in price_cache:
            cached_result, timestamp = price_cache[coin_id]
            if isinstance(cached_result, tuple) and (datetime.now() - timestamp).seconds < CACHE_DURATION:
                return cached_result
        
        # Utiliser requests directement (plus simple et fiable)
        try:
            # Rate limiting : attendre entre les requêtes
            global last_api_call
            if last_api_call:
                time_since_last = (datetime.now() - last_api_call).total_seconds()
                if time_since_last < MIN_API_INTERVAL:
                    wait_time = MIN_API_INTERVAL - time_since_last
                    print(f"⏳ Rate limiting: attente {wait_time:.1f}s...")
                    await asyncio.sleep(wait_time)
            
            url = f"{COINGECKO_API_URL}/simple/price"
            params = {
                'ids': coin_id,
                'vs_currencies': 'usd',
                'include_24hr_change': 'true',
                'include_market_cap': 'true',
                'include_24hr_vol': 'true'
            }
            
            print(f"🔍 Requête API CoinGecko pour: {coin_id}")
            last_api_call = datetime.now()
            
            # Utiliser requests dans un thread pour ne pas bloquer
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: sync_requests.get(url, params=params, timeout=10)
            )
            
            print(f"📡 Status code: {response.status_code}")
            
            # Gérer le rate limiting (429)
            if response.status_code == 429:
                print(f"⚠️ Rate limit atteint (429). Attente 10 secondes...")
                await asyncio.sleep(10)
                # Réessayer une fois
                response = await loop.run_in_executor(
                    None,
                    lambda: sync_requests.get(url, params=params, timeout=10)
                )
                last_api_call = datetime.now()
            
            response.raise_for_status()
            data = response.json()
            
            if coin_id in data:
                token_data = data[coin_id]
                price = token_data['usd']
                change_24h = token_data.get('usd_24h_change', 0)
                market_cap = token_data.get('usd_market_cap', 0)
                volume_24h = token_data.get('usd_24h_vol', 0)
                
                result = (price, change_24h, market_cap, volume_24h)
                price_cache[coin_id] = (result, datetime.now())
                print(f"✅ Prix récupéré pour {coin_id}: ${price}")
                return result
            
            print(f"❌ Token {coin_id} non trouvé dans CoinGecko")
            return None
        except sync_requests.exceptions.Timeout:
            print(f"⏱️ Timeout API CoinGecko pour {coin_id}")
            return None
        except sync_requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                print(f"⚠️ Rate limit CoinGecko (429). Utilisez le cache ou attendez.")
            else:
                print(f"❌ Erreur HTTP API CoinGecko pour {coin_id}: {e}")
            return None
        except Exception as e:
            print(f"❌ Erreur API CoinGecko pour {coin_id}: {type(e).__name__} - {str(e)}")
            return None
    
    async def get_multiple_prices(self, token_ids: List[str]) -> Dict[str, tuple]:
        """Récupère plusieurs prix en parallèle"""
        tasks = [self.get_price(token_id) for token_id in token_ids]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return {
            token_id: result 
            for token_id, result in zip(token_ids, results)
            if result and not isinstance(result, Exception)
        }
    
    async def get_wallet_balance(self, address: str) -> Optional[float]:
        """Récupère le solde ETH d'un wallet"""
        if not ETHERSCAN_API_KEY:
            return None
        
        try:
            url = "https://api.etherscan.io/api"
            params = {
                'module': 'account',
                'action': 'balance',
                'address': address,
                'tag': 'latest',
                'apikey': ETHERSCAN_API_KEY
            }
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: sync_requests.get(url, params=params, timeout=10)
            )
            response.raise_for_status()
            data = response.json()
            
            if data.get('status') == '1':
                balance_wei = int(data['result'])
                return balance_wei / 1e18
            return None
        except Exception as e:
            print(f"Erreur API Etherscan: {e}")
            return None
    
    async def get_wallet_tokens(self, address: str) -> List[Dict]:
        """Récupère les tokens ERC20 d'un wallet"""
        if not ETHERSCAN_API_KEY:
            return []
        
        try:
            url = "https://api.etherscan.io/api"
            params = {
                'module': 'account',
                'action': 'tokentx',
                'address': address,
                'startblock': 0,
                'endblock': 99999999,
                'sort': 'desc',
                'apikey': ETHERSCAN_API_KEY
            }
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: sync_requests.get(url, params=params, timeout=10)
            )
            response.raise_for_status()
            data = response.json()
            
            if data.get('status') == '1':
                return data.get('result', [])
            return []
        except Exception as e:
            print(f"Erreur récupération tokens wallet: {e}")
            return []
    
    async def get_new_tokens(self, chain: str = 'ethereum', limit: int = 10) -> List[Dict]:
        """Récupère les nouveaux tokens depuis DexScreener (sniper)"""
        try:
            url = f"{DEXSCREENER_API_URL}/tokens/{chain}"
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: sync_requests.get(url, timeout=10)
            )
            response.raise_for_status()
            data = response.json()
            
            pairs = data.get('pairs', [])[:limit]
            new_tokens = []
            
            for pair in pairs:
                if pair.get('createdAt'):
                    created_at = datetime.fromtimestamp(pair['createdAt'] / 1000)
                    # Tokens créés dans les dernières 24h
                    if datetime.now() - created_at < timedelta(hours=24):
                        new_tokens.append({
                            'address': pair.get('baseToken', {}).get('address'),
                            'symbol': pair.get('baseToken', {}).get('symbol'),
                            'name': pair.get('baseToken', {}).get('name'),
                            'price': pair.get('priceUsd'),
                            'liquidity': pair.get('liquidity', {}).get('usd'),
                            'volume_24h': pair.get('volume', {}).get('h24'),
                            'created_at': created_at
                        })
            
            return sorted(new_tokens, key=lambda x: x.get('created_at', datetime.min), reverse=True)
        except Exception as e:
            print(f"Erreur DexScreener: {e}")
            return []
    
    async def check_rugpull_indicators(self, token_address: str) -> Dict:
        """Vérifie les indicateurs de rugpull"""
        indicators = {
            'high_risk': False,
            'warnings': [],
            'score': 100
        }
        
        try:
            # Vérifier la liquidité
            url = f"{DEXSCREENER_API_URL}/tokens/{token_address}"
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: sync_requests.get(url, timeout=10)
            )
            response.raise_for_status()
            data = response.json()
            
            pairs = data.get('pairs', [])
            if pairs:
                pair = pairs[0]
                liquidity = pair.get('liquidity', {}).get('usd', 0)
                holders = pair.get('holders', 0)
                locked = pair.get('info', {}).get('lock', False)
                
                # Indicateurs de risque
                if liquidity < 10000:
                    indicators['warnings'].append('⚠️ Liquidité très faible')
                    indicators['score'] -= 30
                
                if holders < 100:
                    indicators['warnings'].append('⚠️ Peu de holders')
                    indicators['score'] -= 20
                
                if not locked:
                    indicators['warnings'].append('⚠️ Liquidité non verrouillée')
                    indicators['score'] -= 25
                
                # Vérifier la variation de prix
                price_change = pair.get('priceChange', {}).get('h24', 0)
                if abs(price_change) > 90:
                    indicators['warnings'].append('⚠️ Variation extrême (possible pump & dump)')
                    indicators['score'] -= 15
                
                if indicators['score'] < 50:
                    indicators['high_risk'] = True
                    indicators['warnings'].append('🚨 RISQUE ÉLEVÉ DE RUGPULL')
            
        except Exception as e:
            print(f"Erreur vérification rugpull: {e}")
        
        return indicators
    
    async def close(self):
        """Ferme le client HTTP (plus nécessaire avec requests)"""
        pass

# Instance globale de l'API
crypto_api = CryptoAPI()

# ==================== INTERFACE UTILISATEUR ====================

def get_main_menu() -> InlineKeyboardMarkup:
    """Retourne le menu principal avec boutons inline"""
    keyboard = [
        [
            InlineKeyboardButton("💰 Prix Crypto", callback_data="menu_prices"),
            InlineKeyboardButton("🔔 Alertes", callback_data="menu_alerts")
        ],
        [
            InlineKeyboardButton("🎯 Sniper Tokens", callback_data="menu_sniper"),
            InlineKeyboardButton("🛡️ Rugpull Check", callback_data="menu_rugpull")
        ],
        [
            InlineKeyboardButton("👛 Wallets", callback_data="menu_wallets"),
            InlineKeyboardButton("📊 Dashboard", callback_data="menu_dashboard")
        ],
        [
            InlineKeyboardButton("⚙️ Paramètres", callback_data="menu_settings"),
            InlineKeyboardButton("ℹ️ Aide", callback_data="menu_help")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)

def get_prices_menu() -> InlineKeyboardMarkup:
    """Menu pour les prix"""
    keyboard = [
        [
            InlineKeyboardButton("🟡 BTC", callback_data="price_bitcoin"),
            InlineKeyboardButton("🔵 ETH", callback_data="price_ethereum")
        ],
        [
            InlineKeyboardButton("🟣 SOL", callback_data="price_solana"),
            InlineKeyboardButton("🔴 ADA", callback_data="price_cardano")
        ],
        [
            InlineKeyboardButton("🟢 BNB", callback_data="price_binancecoin"),
            InlineKeyboardButton("⚪ DOT", callback_data="price_polkadot")
        ],
        [InlineKeyboardButton("🔙 Retour", callback_data="menu_main")]
    ]
    return InlineKeyboardMarkup(keyboard)

def get_alerts_menu() -> InlineKeyboardMarkup:
    """Menu pour les alertes"""
    keyboard = [
        [
            InlineKeyboardButton("✅ ETH", callback_data="alert_toggle_ethereum"),
            InlineKeyboardButton("✅ BTC", callback_data="alert_toggle_bitcoin")
        ],
        [
            InlineKeyboardButton("➕ Ajouter Token", callback_data="alert_add_token"),
            InlineKeyboardButton("📋 Mes Alertes", callback_data="alert_list")
        ],
        [InlineKeyboardButton("🔙 Retour", callback_data="menu_main")]
    ]
    return InlineKeyboardMarkup(keyboard)

# ==================== COMMANDES ====================

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Commande /start avec menu interactif"""
    user_id = update.effective_user.id
    user_name = update.effective_user.first_name or "Utilisateur"
    
    # Initialiser les paramètres utilisateur
    if user_id not in user_settings:
        user_settings[user_id] = {
            'alert_threshold': 5.0,  # 5% par défaut
            'notifications_enabled': True
        }
    
    welcome_text = (
        f"👋 Bienvenue {user_name}!\n\n"
        "🤖 **Bot Crypto Pro** - Votre assistant crypto complet\n\n"
        "✨ **Fonctionnalités:**\n"
        "• 💰 Prix en temps réel (BTC, ETH, +1000 tokens)\n"
        "• 🔔 Alertes personnalisées\n"
        "• 🎯 Sniper nouveaux tokens\n"
        "• 🛡️ Détection rugpull\n"
        "• 👛 Suivi de wallets\n"
        "• 📊 Dashboard web\n\n"
        "Utilisez le menu ci-dessous pour naviguer 👇"
    )
    
    await update.message.reply_text(
        welcome_text,
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=get_main_menu()
    )

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Gère les clics sur les boutons inline"""
    query = update.callback_query
    await query.answer()
    
    user_id = query.from_user.id
    data = query.data
    
    if data == "menu_main":
        await query.edit_message_text(
            "🏠 **Menu Principal**\n\nChoisissez une option:",
            parse_mode=ParseMode.MARKDOWN,
            reply_markup=get_main_menu()
        )
    
    elif data == "menu_prices":
        await query.edit_message_text(
            "💰 **Prix Crypto**\n\nSélectionnez une cryptomonnaie:",
            parse_mode=ParseMode.MARKDOWN,
            reply_markup=get_prices_menu()
        )
    
    elif data.startswith("price_"):
        token_id = data.replace("price_", "")
        await show_price(query, token_id)
    
    elif data == "menu_alerts":
        await query.edit_message_text(
            "🔔 **Gestion des Alertes**\n\nConfigurez vos alertes:",
            parse_mode=ParseMode.MARKDOWN,
            reply_markup=get_alerts_menu()
        )
    
    elif data.startswith("alert_toggle_"):
        token_id = data.replace("alert_toggle_", "")
        await toggle_alert(query, user_id, token_id)
    
    elif data == "menu_sniper":
        await show_sniper_menu(query, user_id)
    
    elif data == "menu_rugpull":
        await query.edit_message_text(
            "🛡️ **Vérification Rugpull**\n\n"
            "Envoyez l'adresse du token à vérifier:\n"
            "Format: `0x...`",
            parse_mode=ParseMode.MARKDOWN,
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton("🔙 Retour", callback_data="menu_main")
            ]])
        )
    
    elif data == "menu_wallets":
        await show_wallets_menu(query, user_id)
    
    elif data == "menu_dashboard":
        await query.edit_message_text(
            "📊 **Dashboard Web**\n\n"
            "Le dashboard web sera disponible prochainement.\n"
            "URL: https://votre-bot.onrender.com/dashboard",
            parse_mode=ParseMode.MARKDOWN,
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton("🔙 Retour", callback_data="menu_main")
            ]])
        )
    
    elif data == "menu_settings":
        await show_settings(query, user_id)
    
    elif data == "menu_help":
        await show_help(query)
    
    elif data.startswith("rugpull_"):
        token_address = data.replace("rugpull_", "")
        await query.edit_message_text("⏳ Analyse en cours...")
        indicators = await crypto_api.check_rugpull_indicators(token_address)
        
        if indicators['high_risk']:
            message = "🚨 **RISQUE ÉLEVÉ DE RUGPULL**\n\n"
        else:
            message = f"🛡️ **Score de sécurité: {indicators['score']}/100**\n\n"
        
        if indicators['warnings']:
            message += "⚠️ **Avertissements:**\n"
            for warning in indicators['warnings']:
                message += f"• {warning}\n"
        else:
            message += "✅ Aucun avertissement détecté"
        
        keyboard = [[InlineKeyboardButton("🔙 Retour", callback_data="menu_main")]]
        await query.edit_message_text(
            message,
            parse_mode=ParseMode.MARKDOWN,
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    elif data.startswith("wallet_"):
        wallet_address = data.replace("wallet_", "")
        balance = await crypto_api.get_wallet_balance(wallet_address)
        
        message = f"👛 **Wallet**\n\n📍 `{wallet_address}`\n"
        if balance is not None:
            eth_price, _, _, _ = await crypto_api.get_price('ethereum') or (0, 0, 0, 0)
            value_usd = balance * eth_price if eth_price else 0
            message += f"💎 Balance: {balance:.6f} ETH\n"
            message += f"💵 Valeur: ${value_usd:,.2f}"
        else:
            message += "❌ Impossible de récupérer le solde"
        
        keyboard = [[InlineKeyboardButton("🔙 Retour", callback_data="menu_wallets")]]
        await query.edit_message_text(
            message,
            parse_mode=ParseMode.MARKDOWN,
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    elif data.startswith("alert_add_"):
        token_id = data.replace("alert_add_", "")
        await toggle_alert(query, user_id, token_id)

async def show_price(query, token_id: str):
    """Affiche le prix d'un token"""
    await query.edit_message_text("⏳ Récupération du prix...")
    
    result = await crypto_api.get_price(token_id)
    
    if not result:
        await query.edit_message_text(
            f"❌ Impossible de récupérer le prix de {token_id}",
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton("🔙 Retour", callback_data="menu_prices")
            ]])
        )
        return
    
    price, change_24h, market_cap, volume_24h = result
    change_emoji = "📈" if change_24h >= 0 else "📉"
    change_color = "🟢" if change_24h >= 0 else "🔴"
    
    message = (
        f"{change_emoji} **{token_id.upper()}**\n\n"
        f"💵 Prix: **${price:,.4f}**\n"
        f"{change_color} 24h: {change_24h:+.2f}%\n"
        f"📊 Market Cap: ${market_cap:,.0f}\n"
        f"💹 Volume 24h: ${volume_24h:,.0f}"
    )
    
    keyboard = [
        [InlineKeyboardButton("🔔 Activer Alerte", callback_data=f"alert_add_{token_id}")],
        [InlineKeyboardButton("🔙 Retour", callback_data="menu_prices")]
    ]
    
    await query.edit_message_text(
        message,
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

async def toggle_alert(query, user_id: int, token_id: str):
    """Active/désactive une alerte"""
    if token_id not in alert_subscribers:
        alert_subscribers[token_id] = set()
    
    if user_id in alert_subscribers[token_id]:
        alert_subscribers[token_id].discard(user_id)
        status = "❌ Désactivée"
    else:
        alert_subscribers[token_id].add(user_id)
        status = "✅ Activée"
    
    await query.edit_message_text(
        f"🔔 Alerte {token_id.upper()}: {status}",
        reply_markup=get_alerts_menu()
    )

async def show_sniper_menu(query, user_id: int):
    """Affiche le menu sniper"""
    await query.edit_message_text("⏳ Recherche de nouveaux tokens...")
    
    new_tokens = await crypto_api.get_new_tokens()
    
    if not new_tokens:
        await query.edit_message_text(
            "ℹ️ Aucun nouveau token trouvé récemment.",
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton("🔙 Retour", callback_data="menu_main")
            ]])
        )
        return
    
    message = "🎯 **Nouveaux Tokens (24h)**\n\n"
    keyboard = []
    
    for i, token in enumerate(new_tokens[:5]):
        symbol = token.get('symbol', 'N/A')
        price = token.get('price', 0)
        liquidity = token.get('liquidity', 0)
        
        message += (
            f"{i+1}. **{symbol}**\n"
            f"   💵 ${price:.8f}\n"
            f"   💧 Liquidité: ${liquidity:,.0f}\n\n"
        )
        
        if token.get('address'):
            keyboard.append([InlineKeyboardButton(
                f"🛡️ Vérifier {symbol}",
                callback_data=f"rugpull_{token['address']}"
            )])
    
    keyboard.append([InlineKeyboardButton("🔙 Retour", callback_data="menu_main")])
    
    await query.edit_message_text(
        message,
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

async def show_wallets_menu(query, user_id: int):
    """Affiche le menu des wallets"""
    wallets = tracked_wallets.get(user_id, set())
    
    if not wallets:
        message = (
            "👛 **Mes Wallets**\n\n"
            "Aucun wallet suivi.\n\n"
            "Pour ajouter un wallet, utilisez:\n"
            "`/addwallet 0x...`"
        )
    else:
        message = "👛 **Mes Wallets**\n\n"
        keyboard = []
        for i, wallet in enumerate(list(wallets)[:5]):
            short_addr = f"{wallet[:6]}...{wallet[-4]}"
            message += f"{i+1}. `{short_addr}`\n"
            keyboard.append([InlineKeyboardButton(
                f"📊 Voir {short_addr}",
                callback_data=f"wallet_{wallet}"
            )])
    
    keyboard.append([InlineKeyboardButton("🔙 Retour", callback_data="menu_main")])
    
    await query.edit_message_text(
        message,
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

async def show_settings(query, user_id: int):
    """Affiche les paramètres"""
    settings = user_settings.get(user_id, {})
    threshold = settings.get('alert_threshold', 5.0)
    
    message = (
        "⚙️ **Paramètres**\n\n"
        f"🔔 Seuil d'alerte: {threshold}%\n"
        f"🔔 Notifications: {'✅ Activées' if settings.get('notifications_enabled') else '❌ Désactivées'}\n\n"
        "Utilisez `/setthreshold <pourcentage>` pour changer le seuil."
    )
    
    keyboard = [[InlineKeyboardButton("🔙 Retour", callback_data="menu_main")]]
    
    await query.edit_message_text(
        message,
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

async def show_help(query):
    """Affiche l'aide"""
    help_text = (
        "ℹ️ **Aide - Bot Crypto Pro**\n\n"
        "**Commandes principales:**\n"
        "• `/start` - Menu principal\n"
        "• `/price <token>` - Prix d'un token\n"
        "• `/alert <token>` - Activer une alerte\n"
        "• `/addwallet <adresse>` - Ajouter un wallet\n"
        "• `/sniper` - Nouveaux tokens\n"
        "• `/rugpull <adresse>` - Vérifier rugpull\n"
        "• `/settings` - Paramètres\n\n"
        "**Exemples:**\n"
        "• `/price bitcoin`\n"
        "• `/alert ethereum`\n"
        "• `/addwallet 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`"
    )
    
    keyboard = [[InlineKeyboardButton("🔙 Retour", callback_data="menu_main")]]
    
    await query.edit_message_text(
        help_text,
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

# ==================== COMMANDES TEXTUELLES ====================

async def price_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Commande /price"""
    if not context.args:
        await update.message.reply_text(
            "Usage: `/price <token_id>`\nExemple: `/price bitcoin`",
            parse_mode=ParseMode.MARKDOWN
        )
        return
    
    token_id = context.args[0].lower()
    if not SecurityValidator.validate_token_id(token_id):
        await update.message.reply_text("❌ ID de token invalide")
        return
    
    result = await crypto_api.get_price(token_id)
    
    if not result:
        await update.message.reply_text(
            f"❌ Token '{token_id}' introuvable.\n\n"
            "💡 Essayez avec l'ID CoinGecko exact ou utilisez:\n"
            "• `/price btc` ou `/price eth`\n"
            "• Utilisez le menu 💰 Prix Crypto pour voir les options disponibles"
        )
        return
    
    price, change_24h, market_cap, volume_24h = result
    change_emoji = "📈" if change_24h >= 0 else "📉"
    
    message = (
        f"{change_emoji} **{token_id.upper()}**\n\n"
        f"💵 **${price:,.4f}**\n"
        f"📊 24h: {change_24h:+.2f}%\n"
        f"💰 Market Cap: ${market_cap:,.0f}\n"
        f"💹 Volume: ${volume_24h:,.0f}"
    )
    
    await update.message.reply_text(message, parse_mode=ParseMode.MARKDOWN)

async def add_wallet_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Commande /addwallet"""
    if not context.args:
        await update.message.reply_text(
            "Usage: `/addwallet <adresse>`\nExemple: `/addwallet 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`",
            parse_mode=ParseMode.MARKDOWN
        )
        return
    
    address = context.args[0]
    user_id = update.effective_user.id
    
    if not SecurityValidator.validate_ethereum_address(address):
        await update.message.reply_text("❌ Adresse Ethereum invalide")
        return
    
    if user_id not in tracked_wallets:
        tracked_wallets[user_id] = set()
    
    tracked_wallets[user_id].add(address)
    
    balance = await crypto_api.get_wallet_balance(address)
    
    message = f"✅ Wallet ajouté!\n\n📍 `{address[:10]}...{address[-8:]}`"
    if balance is not None:
        message += f"\n💎 Balance: {balance:.6f} ETH"
    
    await update.message.reply_text(message, parse_mode=ParseMode.MARKDOWN)

async def rugpull_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Commande /rugpull"""
    if not context.args:
        await update.message.reply_text(
            "Usage: `/rugpull <adresse_token>`\nExemple: `/rugpull 0x...`",
            parse_mode=ParseMode.MARKDOWN
        )
        return
    
    token_address = context.args[0]
    
    if not SecurityValidator.validate_ethereum_address(token_address):
        await update.message.reply_text("❌ Adresse invalide")
        return
    
    await update.message.reply_text("⏳ Analyse en cours...")
    
    indicators = await crypto_api.check_rugpull_indicators(token_address)
    
    if indicators['high_risk']:
        message = "🚨 **RISQUE ÉLEVÉ DE RUGPULL**\n\n"
    else:
        message = f"🛡️ **Score de sécurité: {indicators['score']}/100**\n\n"
    
    if indicators['warnings']:
        message += "⚠️ **Avertissements:**\n"
        for warning in indicators['warnings']:
            message += f"• {warning}\n"
    else:
        message += "✅ Aucun avertissement détecté"
    
    await update.message.reply_text(message, parse_mode=ParseMode.MARKDOWN)

# ==================== SURVEILLANCE AUTOMATIQUE ====================

async def monitor_prices(context: ContextTypes.DEFAULT_TYPE):
    """Surveille les prix et envoie des alertes"""
    try:
        # Surveiller les tokens avec abonnés
        tokens_to_check = list(alert_subscribers.keys())
        
        if tokens_to_check:
            prices = await crypto_api.get_multiple_prices(tokens_to_check)
            
            for token_id, result in prices.items():
                if not result:
                    continue
                
                price, change_24h, _, _ = result
                subscribers = alert_subscribers.get(token_id, set())
                
                if not subscribers:
                    continue
                
                # Vérifier si changement significatif
                if abs(change_24h) >= 5.0:  # Seuil par défaut 5%
                    change_emoji = "📈" if change_24h >= 0 else "📉"
                    message = (
                        f"{change_emoji} **Alerte {token_id.upper()}**\n\n"
                        f"Variation 24h: **{change_24h:+.2f}%**\n"
                        f"Prix actuel: **${price:,.4f}**"
                    )
                    
                    for user_id in list(subscribers):
                        try:
                            await context.bot.send_message(
                                chat_id=user_id,
                                text=message,
                                parse_mode=ParseMode.MARKDOWN
                            )
                        except Exception as e:
                            print(f"Erreur envoi alerte à {user_id}: {e}")
                            subscribers.discard(user_id)
    
    except Exception as e:
        print(f"Erreur dans monitor_prices: {e}")

# ==================== MAIN ====================

def main():
    """Fonction principale"""
    if not TELEGRAM_BOT_TOKEN:
        print("❌ ERREUR: TELEGRAM_BOT_TOKEN n'est pas défini!")
        import sys
        sys.exit(1)
    
    # Créer l'application
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("price", price_command))
    application.add_handler(CommandHandler("addwallet", add_wallet_command))
    application.add_handler(CommandHandler("rugpull", rugpull_command))
    application.add_handler(CallbackQueryHandler(button_handler))
    
    # Job de surveillance (toutes les 60 secondes)
    job_queue = application.job_queue
    if job_queue:
        job_queue.run_repeating(monitor_prices, interval=60, first=10)
    else:
        print("⚠️ JobQueue non disponible. Installez python-telegram-bot[job-queue]")
    
    print("🤖 Bot Crypto Pro démarré!")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()


