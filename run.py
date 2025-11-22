"""
Fichier principal pour lancer le bot Telegram et le dashboard web
"""
import asyncio
import threading
import os
from bot_pro import main as bot_main
from dashboard import run_dashboard

def run_bot():
    """Lance le bot Telegram"""
    bot_main()

def run_web():
    """Lance le dashboard web"""
    port = int(os.getenv('PORT', 5000))
    run_dashboard(host='0.0.0.0', port=port)

if __name__ == '__main__':
    # Lancer le dashboard dans un thread séparé
    dashboard_thread = threading.Thread(target=run_web, daemon=True)
    dashboard_thread.start()
    
    # Lancer le bot dans le thread principal
    print("🚀 Démarrage du Bot Crypto Pro...")
    print("📊 Dashboard disponible sur http://localhost:5000")
    run_bot()

