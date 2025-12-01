"""Script pour lancer le serveur dashboard π-FI"""
import os
import sys
import socket
import webbrowser
import threading
import time

print("=" * 60)
print("π-FI Dashboard - Démarrage")
print("=" * 60)
print()

# Charger les variables d'environnement
from dotenv import load_dotenv
load_dotenv()

# Importer le dashboard
try:
    from dashboard import app
    print("✅ Dashboard importé")
except Exception as e:
    print(f"❌ Erreur import: {e}")
    import traceback
    traceback.print_exc()
    input("\nAppuyez sur Entrée pour quitter...")
    sys.exit(1)

# FORCER LE PORT 5000 - TOUJOURS LE MÊME PORT
port = 5000
host = '127.0.0.1'

# Vérifier si le port 5000 est occupé et libérer les processus
def check_and_free_port(target_port):
    """Vérifie et libère le port si nécessaire"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', target_port))
    sock.close()
    
    if result == 0:  # Port occupé
        print(f"⚠️  Port {target_port} occupé, nettoyage...")
        import subprocess
        try:
            # Trouver les processus qui utilisent le port
            result = subprocess.run(
                ['netstat', '-ano'],
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='ignore'
            )
            if result.stdout:
                lines = result.stdout.split('\n')
            else:
                lines = []
            pids = set()
            for line in lines:
                if f':{target_port}' in line and 'LISTENING' in line:
                    parts = line.split()
                    if len(parts) > 4:
                        pid = parts[-1]
                        if pid.isdigit():
                            pids.add(pid)
            
            # Arrêter les processus Python qui utilisent le port
            for pid in pids:
                try:
                    subprocess.run(['taskkill', '/F', '/PID', pid], 
                                 capture_output=True, timeout=2)
                except:
                    pass
            
            # Attendre que le port se libère
            time.sleep(2)
            print(f"✅ Port {target_port} libéré")
        except Exception as e:
            print(f"⚠️  Erreur lors du nettoyage: {e}")
    else:
        print(f"✅ Port {target_port} disponible")

check_and_free_port(port)

print(f"📊 Port: {port}")
print(f"🌐 URL: http://localhost:{port}")
print()

# Fonction pour ouvrir le navigateur
def open_browser():
    time.sleep(3)
    url = f'http://localhost:{port}'
    print(f"🌐 Ouverture de {url}...")
    webbrowser.open(url)

# Ouvrir le navigateur dans un thread
browser_thread = threading.Thread(target=open_browser, daemon=True)
browser_thread.start()

print("=" * 60)
print("🚀 SERVEUR DÉMARRÉ!")
print("=" * 60)
print()
print(f"📊 Dashboard disponible sur:")
print(f"   http://localhost:{port}")
print(f"   http://127.0.0.1:{port}")
print()
print("💡 Le navigateur va s'ouvrir automatiquement dans 3 secondes")
print("💡 Appuyez sur Ctrl+C pour arrêter")
print("=" * 60)
print()

try:
    app.run(host=host, port=port, debug=False, threaded=True, use_reloader=False)
except KeyboardInterrupt:
    print("\n\n🛑 Serveur arrêté")
except Exception as e:
    print(f"\n❌ Erreur: {e}")
    import traceback
    traceback.print_exc()
    input("\nAppuyez sur Entrée pour quitter...")

