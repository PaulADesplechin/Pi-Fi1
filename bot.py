import os
import time
import asyncio
from datetime import datetime
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes
from telegram.constants import ParseMode
import requests
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
ETHERSCAN_API_KEY = os.getenv('ETHERSCAN_API_KEY', '')
COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

# Stockage des prix et utilisateurs à notifier
eth_price_history = {}
tracked_tokens = {}  # {user_id: {token: last_price}}
eth_alert_subscribers = set()  # Utilisateurs abonnés aux alertes ETH
monitoring_active = True

class CryptoMonitor:
    def __init__(self):
        self.last_eth_price = None
        self.price_threshold = 0.05  # 5%
        
    async def get_eth_price(self):
        """Récupère le prix actuel de l'ETH depuis CoinGecko"""
        try:
            url = f"{COINGECKO_API_URL}/simple/price"
            params = {
                'ids': 'ethereum',
                'vs_currencies': 'usd',
                'include_24hr_change': 'true'
            }
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if 'ethereum' in data:
                price = data['ethereum']['usd']
                change_24h = data['ethereum'].get('usd_24h_change', 0)
                return price, change_24h
            return None, None
        except Exception as e:
            print(f"Erreur lors de la récupération du prix ETH: {e}")
            return None, None
    
    async def get_token_price(self, token_id):
        """Récupère le prix d'un token depuis CoinGecko"""
        try:
            url = f"{COINGECKO_API_URL}/simple/price"
            params = {
                'ids': token_id.lower(),
                'vs_currencies': 'usd',
                'include_24hr_change': 'true'
            }
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if token_id.lower() in data:
                price = data[token_id.lower()]['usd']
                change_24h = data[token_id.lower()].get('usd_24h_change', 0)
                return price, change_24h
            return None, None
        except Exception as e:
            print(f"Erreur lors de la récupération du prix {token_id}: {e}")
            return None, None
    
    def check_price_change(self, current_price, last_price):
        """Vérifie si le changement de prix dépasse le seuil"""
        if last_price is None:
            return False, 0
        
        change_percent = ((current_price - last_price) / last_price) * 100
        return abs(change_percent) >= (self.price_threshold * 100), change_percent

# Instance globale du moniteur
monitor = CryptoMonitor()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Commande /start"""
    user_id = update.effective_user.id
    eth_alert_subscribers.add(user_id)  # S'abonner automatiquement aux alertes ETH
    
    welcome_message = (
        "🤖 **Bot Crypto Monitor**\n\n"
        "Commandes disponibles:\n"
        "• `/ethprice` - Prix actuel de l'ETH\n"
        "• `/walletbalance <adresse>` - Solde d'un wallet Ethereum\n"
        "• `/track_token <token_id>` - Suivre un token (ex: bitcoin, ethereum)\n"
        "• `/stop_tracking` - Arrêter le suivi des tokens\n"
        "• `/subscribe_eth` - S'abonner aux alertes ETH\n"
        "• `/unsubscribe_eth` - Se désabonner des alertes ETH\n"
        "• `/help` - Afficher cette aide\n\n"
        "✅ Vous êtes maintenant abonné aux alertes ETH (±5%)."
    )
    await update.message.reply_text(welcome_message, parse_mode=ParseMode.MARKDOWN)

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Commande /help"""
    help_text = (
        "📚 **Aide - Bot Crypto Monitor**\n\n"
        "**Commandes:**\n"
        "• `/ethprice` - Affiche le prix actuel de l'ETH\n"
        "• `/walletbalance <adresse>` - Vérifie le solde ETH d'un wallet\n"
        "  Exemple: `/walletbalance 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`\n"
        "• `/track_token <token_id>` - Suit un token et vous alerte des variations\n"
        "  Exemple: `/track_token bitcoin` ou `/track_token ethereum`\n"
        "• `/stop_tracking` - Arrête le suivi de tous vos tokens\n"
        "• `/subscribe_eth` - S'abonner aux alertes ETH (±5%)\n"
        "• `/unsubscribe_eth` - Se désabonner des alertes ETH\n\n"
        "**Surveillance automatique:**\n"
        "Le bot surveille l'ETH et vous envoie une alerte si le prix varie de ±5%."
    )
    await update.message.reply_text(help_text, parse_mode=ParseMode.MARKDOWN)

async def ethprice(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Commande /ethprice - Affiche le prix actuel de l'ETH"""
    price, change_24h = await monitor.get_eth_price()
    
    if price is None:
        await update.message.reply_text("❌ Impossible de récupérer le prix de l'ETH. Réessayez plus tard.")
        return
    
    change_emoji = "📈" if change_24h >= 0 else "📉"
    change_color = "🟢" if change_24h >= 0 else "🔴"
    
    message = (
        f"{change_emoji} **Prix ETH**\n\n"
        f"💵 **${price:,.2f}**\n"
        f"{change_color} 24h: {change_24h:+.2f}%"
    )
    
    await update.message.reply_text(message, parse_mode=ParseMode.MARKDOWN)
    
    # Mettre à jour le dernier prix pour la surveillance
    monitor.last_eth_price = price

async def walletbalance(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Commande /walletbalance - Vérifie le solde d'un wallet Ethereum"""
    if not ETHERSCAN_API_KEY:
        await update.message.reply_text(
            "❌ L'API Etherscan n'est pas configurée. "
            "Ajoutez ETHERSCAN_API_KEY dans vos variables d'environnement."
        )
        return
    
    if not context.args:
        await update.message.reply_text(
            "❌ Veuillez fournir une adresse de wallet.\n"
            "Usage: `/walletbalance <adresse>`\n"
            "Exemple: `/walletbalance 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`",
            parse_mode=ParseMode.MARKDOWN
        )
        return
    
    wallet_address = context.args[0]
    
    # Valider le format de l'adresse Ethereum
    if not wallet_address.startswith('0x') or len(wallet_address) != 42:
        await update.message.reply_text("❌ Adresse Ethereum invalide. Format attendu: 0x...")
        return
    
    try:
        # Récupérer le solde depuis Etherscan
        url = "https://api.etherscan.io/api"
        params = {
            'module': 'account',
            'action': 'balance',
            'address': wallet_address,
            'tag': 'latest',
            'apikey': ETHERSCAN_API_KEY
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data['status'] == '1' and data['message'] == 'OK':
            # Le solde est en Wei, convertir en ETH
            balance_wei = int(data['result'])
            balance_eth = balance_wei / 1e18
            
            # Récupérer le prix ETH pour calculer la valeur en USD
            eth_price, _ = await monitor.get_eth_price()
            value_usd = balance_eth * eth_price if eth_price else None
            
            message = (
                f"💰 **Solde Wallet**\n\n"
                f"📍 Adresse: `{wallet_address[:10]}...{wallet_address[-8:]}`\n"
                f"💎 ETH: **{balance_eth:.6f}**\n"
            )
            
            if value_usd:
                message += f"💵 USD: **${value_usd:,.2f}**"
            
            await update.message.reply_text(message, parse_mode=ParseMode.MARKDOWN)
        else:
            await update.message.reply_text(f"❌ Erreur: {data.get('message', 'Erreur inconnue')}")
            
    except Exception as e:
        await update.message.reply_text(f"❌ Erreur lors de la récupération du solde: {str(e)}")

async def track_token(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Commande /track_token - Suit un token spécifique"""
    if not context.args:
        await update.message.reply_text(
            "❌ Veuillez fournir un token ID.\n"
            "Usage: `/track_token <token_id>`\n"
            "Exemples: `/track_token bitcoin`, `/track_token ethereum`, `/track_token cardano`",
            parse_mode=ParseMode.MARKDOWN
        )
        return
    
    token_id = context.args[0].lower()
    user_id = update.effective_user.id
    
    # Vérifier si le token existe
    price, change_24h = await monitor.get_token_price(token_id)
    
    if price is None:
        await update.message.reply_text(
            f"❌ Token '{token_id}' introuvable.\n"
            "Assurez-vous d'utiliser l'ID CoinGecko (ex: 'bitcoin', 'ethereum', 'cardano')."
        )
        return
    
    # Initialiser le tracking pour cet utilisateur
    if user_id not in tracked_tokens:
        tracked_tokens[user_id] = {}
    
    tracked_tokens[user_id][token_id] = price
    
    message = (
        f"✅ **Token suivi**\n\n"
        f"🪙 Token: **{token_id.upper()}**\n"
        f"💵 Prix actuel: **${price:,.2f}**\n"
        f"📊 24h: {change_24h:+.2f}%\n\n"
        f"Vous recevrez une alerte si le prix varie de ±5%."
    )
    
    await update.message.reply_text(message, parse_mode=ParseMode.MARKDOWN)

async def stop_tracking(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Commande /stop_tracking - Arrête le suivi des tokens"""
    user_id = update.effective_user.id
    
    if user_id in tracked_tokens and tracked_tokens[user_id]:
        count = len(tracked_tokens[user_id])
        tracked_tokens[user_id] = {}
        await update.message.reply_text(
            f"✅ Suivi arrêté pour {count} token(s)."
        )
    else:
        await update.message.reply_text("ℹ️ Aucun token suivi actuellement.")

async def subscribe_eth(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Commande /subscribe_eth - S'abonner aux alertes ETH"""
    user_id = update.effective_user.id
    eth_alert_subscribers.add(user_id)
    await update.message.reply_text(
        "✅ Vous êtes maintenant abonné aux alertes ETH.\n"
        "Vous recevrez une notification si le prix varie de ±5%."
    )

async def unsubscribe_eth(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Commande /unsubscribe_eth - Se désabonner des alertes ETH"""
    user_id = update.effective_user.id
    eth_alert_subscribers.discard(user_id)
    await update.message.reply_text(
        "❌ Vous êtes maintenant désabonné des alertes ETH."
    )

async def monitor_prices(context: ContextTypes.DEFAULT_TYPE):
    """Fonction de surveillance périodique des prix"""
    global monitoring_active
    
    if not monitoring_active:
        return
    
    try:
        # Surveiller l'ETH
        current_price, change_24h = await monitor.get_eth_price()
        
        if current_price is not None:
            if monitor.last_eth_price is not None:
                significant_change, change_percent = monitor.check_price_change(
                    current_price, monitor.last_eth_price
                )
                
                if significant_change:
                    # Envoyer une alerte à tous les abonnés
                    message = (
                        f"🚨 **Alerte ETH**\n\n"
                        f"Variation détectée: **{change_percent:+.2f}%**\n"
                        f"Prix précédent: ${monitor.last_eth_price:,.2f}\n"
                        f"Prix actuel: ${current_price:,.2f}\n"
                        f"📊 24h: {change_24h:+.2f}%"
                    )
                    
                    # Envoyer aux utilisateurs abonnés
                    for user_id in list(eth_alert_subscribers):
                        try:
                            await context.bot.send_message(
                                chat_id=user_id,
                                text=message,
                                parse_mode=ParseMode.MARKDOWN
                            )
                        except Exception as e:
                            print(f"Erreur lors de l'envoi de l'alerte ETH à {user_id}: {e}")
                            # Retirer les utilisateurs qui ont bloqué le bot
                            eth_alert_subscribers.discard(user_id)
            
            monitor.last_eth_price = current_price
        
        # Surveiller les tokens suivis
        for user_id, tokens in list(tracked_tokens.items()):
            for token_id, last_price in list(tokens.items()):
                current_token_price, token_change_24h = await monitor.get_token_price(token_id)
                
                if current_token_price is not None:
                    significant_change, change_percent = monitor.check_price_change(
                        current_token_price, last_price
                    )
                    
                    if significant_change:
                        try:
                            message = (
                                f"🚨 **Alerte {token_id.upper()}**\n\n"
                                f"Variation détectée: **{change_percent:+.2f}%**\n"
                                f"Prix précédent: ${last_price:,.2f}\n"
                                f"Prix actuel: ${current_token_price:,.2f}\n"
                                f"📊 24h: {token_change_24h:+.2f}%"
                            )
                            
                            await context.bot.send_message(
                                chat_id=user_id,
                                text=message,
                                parse_mode=ParseMode.MARKDOWN
                            )
                            
                            # Mettre à jour le prix
                            tracked_tokens[user_id][token_id] = current_token_price
                        except Exception as e:
                            print(f"Erreur lors de l'envoi de l'alerte à {user_id}: {e}")
    
    except Exception as e:
        print(f"Erreur dans monitor_prices: {e}")

def main():
    """Fonction principale pour démarrer le bot"""
    if not TELEGRAM_BOT_TOKEN:
        print("❌ ERREUR: TELEGRAM_BOT_TOKEN n'est pas défini!")
        print("Pour le développement local: Créez un fichier .env avec votre token Telegram Bot.")
        print("Pour Render.com: Ajoutez TELEGRAM_BOT_TOKEN dans Environment Variables.")
        print("Valeur attendue: 8472604934:AAFcRXynmy2MKxRx4KbIAYGGtutijku5_H0")
        import sys
        sys.exit(1)
    
    # Créer l'application
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Ajouter les handlers de commandes
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("ethprice", ethprice))
    application.add_handler(CommandHandler("walletbalance", walletbalance))
    application.add_handler(CommandHandler("track_token", track_token))
    application.add_handler(CommandHandler("stop_tracking", stop_tracking))
    application.add_handler(CommandHandler("subscribe_eth", subscribe_eth))
    application.add_handler(CommandHandler("unsubscribe_eth", unsubscribe_eth))
    
    # Ajouter le job de surveillance (vérifie toutes les 60 secondes)
    job_queue = application.job_queue
    if job_queue:
        job_queue.run_repeating(monitor_prices, interval=60, first=10)
    else:
        print("⚠️ JobQueue non disponible. Les alertes automatiques ne fonctionneront pas.")
    
    # Démarrer le bot
    print("🤖 Bot démarré! Appuyez sur Ctrl+C pour arrêter.")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()

