"""
Fichier principal pour lancer le bot Telegram et le dashboard web
Sur Render.com, Flask doit être le processus principal pour écouter sur le port
"""
import threading
import os
import sys
import time
from bot_pro import main as bot_main
from dashboard import app, run_dashboard

# Configurer l'encodage UTF-8 pour Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def run_bot():
    """Lance le bot Telegram dans un thread séparé"""
    try:
        print("[BOT] Démarrage du bot Telegram...")
        time.sleep(1)  # Petit délai pour que Flask démarre d'abord
        bot_main()
    except KeyboardInterrupt:
        print("[BOT] Arrêt demandé...")
    except Exception as e:
        print(f"[ERREUR] Erreur dans le bot: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    # Vérifier le token avant de démarrer
    from dotenv import load_dotenv
    load_dotenv()
    
    token = os.getenv('TELEGRAM_BOT_TOKEN')
    if not token or token == 'your_telegram_bot_token_here':
        print("❌ ERREUR: TELEGRAM_BOT_TOKEN n'est pas configuré!")
        print("📝 Créez un fichier .env avec votre token Telegram Bot.")
        print("💡 Consultez GUIDE_DEMARRAGE_LOCAL.md pour plus d'informations")
        sys.exit(1)
    
    # Sur Render.com, Flask doit être le processus principal
    # Lancer le bot dans un thread séparé
    bot_thread = threading.Thread(target=run_bot, daemon=True)
    bot_thread.start()
    
    # Lancer Flask dans le processus principal (nécessaire pour Render.com)
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    
    # En local, utiliser 127.0.0.1 pour plus de sécurité
    if host == '0.0.0.0' and os.getenv('ENV') != 'production':
        host = '127.0.0.1'
    
    print(f"[START] π-FI | AI Powered Finance & Intelligence")
    print(f"[START] Mathematics. Intelligence. Results.")
    print(f"[DASHBOARD] Disponible sur http://{host}:{port}")
    print(f"[BOT] Bot Telegram démarre en arrière-plan")
    print(f"[INFO] Appuyez sur Ctrl+C pour arrêter")
    
    try:
        # Flask doit être le processus principal pour Render.com
        app.run(host=host, port=port, debug=False, threaded=True)
    except KeyboardInterrupt:
        print("\n[STOP] Arrêt de π-FI...")
        print("[STOP] Arrêt effectué proprement.")

