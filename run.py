"""
Fichier principal pour lancer le bot Telegram et le dashboard web
Sur Render.com, Flask doit être le processus principal pour écouter sur le port
"""
import threading
import os
from bot_pro import main as bot_main
from dashboard import app, run_dashboard

def run_bot():
    """Lance le bot Telegram dans un thread séparé"""
    try:
        print("🤖 Démarrage du bot Telegram...")
        bot_main()
    except Exception as e:
        print(f"❌ Erreur dans le bot: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    # Sur Render.com, Flask doit être le processus principal
    # Lancer le bot dans un thread séparé
    bot_thread = threading.Thread(target=run_bot, daemon=True)
    bot_thread.start()
    
    # Lancer Flask dans le processus principal (nécessaire pour Render.com)
    port = int(os.getenv('PORT', 5000))
    print(f"🚀 Démarrage du Bot Crypto Pro...")
    print(f"📊 Dashboard disponible sur http://0.0.0.0:{port}")
    print(f"🤖 Bot Telegram démarré en arrière-plan")
    
    # Flask doit être le processus principal pour Render.com
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)

