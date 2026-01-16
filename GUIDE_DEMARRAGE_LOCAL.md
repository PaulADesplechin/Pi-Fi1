# 🚀 Guide de Démarrage Local - π-FI

**Mathematics. Intelligence. Results.**

Ce guide vous explique comment démarrer π-FI en local sur votre machine Windows.

---

## 📋 Prérequis

1. **Python 3.8+** installé
   - Télécharger depuis [python.org](https://www.python.org/downloads/)
   - ⚠️ Cochez "Add Python to PATH" lors de l'installation

2. **Token Telegram Bot**
   - Ouvrez Telegram et cherchez **@BotFather**
   - Envoyez `/newbot` et suivez les instructions
   - Copiez le token fourni

3. **Clé API Etherscan** (optionnel)
   - Créez un compte sur [Etherscan.io](https://etherscan.io)
   - Allez dans [API-KEYs](https://etherscan.io/apis)
   - Créez une nouvelle clé API

---

## 🚀 Démarrage Rapide

### Méthode 1 : Script automatique (Recommandé)

1. **Double-cliquez sur `start_local.bat`**
   - Le script vérifie automatiquement les dépendances
   - Crée le fichier `.env` si nécessaire
   - Installe les dépendances si besoin
   - Lance le bot et le dashboard

2. **Si le fichier `.env` est créé automatiquement** :
   - Ouvrez le fichier `.env` avec un éditeur de texte
   - Remplacez `your_telegram_bot_token_here` par votre token Telegram
   - Sauvegardez et relancez `start_local.bat`

### Méthode 2 : Démarrage manuel

1. **Ouvrir PowerShell ou CMD** dans le dossier du projet

2. **Créer le fichier .env** :
   ```bash
   copy env.example .env
   ```

3. **Éditer le fichier .env** :
   - Ouvrez `.env` avec un éditeur de texte (Notepad, VS Code, etc.)
   - Remplacez `your_telegram_bot_token_here` par votre token Telegram
   - Exemple : `TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
   - (Optionnel) Ajoutez votre clé Etherscan : `ETHERSCAN_API_KEY=votre_cle_ici`

4. **Installer les dépendances** :
   ```bash
   pip install -r requirements.txt
   ```

5. **Lancer le projet** :
   ```bash
   python start_local.py
   ```
   ou
   ```bash
   python run.py
   ```

---

## ✅ Vérification

Une fois démarré, vous devriez voir :

```
============================================================
π-FI | AI Powered Finance & Intelligence
Mathematics. Intelligence. Results.
============================================================

✅ Configuration validée!

🚀 Démarrage de π-FI...
------------------------------------------------------------

[BOT] Démarrage du bot Telegram...
============================================================
✅ π-FI est maintenant opérationnel!
============================================================

📊 Dashboard: http://localhost:5000
🤖 Bot Telegram: En cours d'exécution

💡 Appuyez sur Ctrl+C pour arrêter
============================================================
```

---

## 🌐 Accès aux Services

- **Dashboard Web** : http://localhost:5000
- **Bot Telegram** : Recherchez votre bot sur Telegram et envoyez `/start`

---

## 🔧 Dépannage

### Erreur : "Python n'est pas reconnu"
- Vérifiez que Python est installé : `python --version`
- Ajoutez Python au PATH système

### Erreur : "TELEGRAM_BOT_TOKEN n'est pas défini"
- Vérifiez que le fichier `.env` existe
- Vérifiez que le token est correctement configuré dans `.env`
- Le format doit être : `TELEGRAM_BOT_TOKEN=votre_token_ici`

### Erreur : "Module not found"
- Installez les dépendances : `pip install -r requirements.txt`
- Vérifiez que vous êtes dans le bon dossier

### Le bot ne répond pas
- Vérifiez que le token Telegram est correct
- Vérifiez que le bot n'est pas bloqué dans Telegram
- Vérifiez les logs dans la console

### Le dashboard ne s'ouvre pas
- Vérifiez que le port 5000 n'est pas utilisé par un autre programme
- Changez le port dans `.env` : `PORT=5001`
- Accédez à http://localhost:5001

---

## 📱 Commandes Telegram Disponibles

Une fois le bot démarré, envoyez ces commandes sur Telegram :

- `/start` - Menu principal
- `/help` - Aide complète
- `/price <token>` - Prix d'un token (ex: `/price bitcoin`)
- `/alert <token> <seuil>` - Créer une alerte
- `/wallet <adresse>` - Suivre un wallet
- `/sniper` - Activer le sniper de nouveaux tokens

---

## 🛑 Arrêter le Projet

Pour arrêter π-FI :
- Appuyez sur **Ctrl+C** dans la fenêtre de commande
- Le bot et le dashboard s'arrêteront proprement

---

## 📝 Notes Importantes

- Le bot vérifie les prix toutes les 60 secondes
- Les alertes sont envoyées si la variation dépasse ±5%
- Les données sont stockées en mémoire (perdus au redémarrage)
- Pour la production, utilisez une base de données

---

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez ce guide de dépannage
2. Consultez les logs dans la console
3. Vérifiez que toutes les dépendances sont installées
4. Vérifiez que le fichier `.env` est correctement configuré

---

**π-FI | AI Powered Finance & Intelligence**

