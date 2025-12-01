# π-FI Dashboard

Dashboard crypto avec bot Telegram.

## 🚀 Démarrage Rapide

1. **Installer les dépendances:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configurer le fichier `.env`:**
   ```
   TELEGRAM_BOT_TOKEN=votre_token_ici
   ETHERSCAN_API_KEY=votre_cle_api_ici
   PORT=5000
   ```

3. **Démarrer le dashboard:**
   - Double-cliquez sur `DEMARRER_5000.bat`
   - Ou double-cliquez sur `LANCER.bat`
   - Ou exécutez: `python lancer.py`

4. **Accéder au dashboard:**
   - Ouvrez votre navigateur sur: **http://localhost:5000**

## 📁 Structure du Projet

- `dashboard.py` - Application Flask principale
- `bot_pro.py` - Bot Telegram
- `run.py` - Script pour déploiement (Render.com)
- `lancer.py` - Script de démarrage local
- `shared_data.py` - Données partagées entre bot et dashboard
- `requirements.txt` - Dépendances Python
- `static/` - Fichiers statiques (logo, CSS, etc.)
- `branding/` - Guide de marque et assets

## 🌐 Liens

- **Dashboard local:** http://localhost:5000
- **API Prix:** http://localhost:5000/api/prices
- **Logo:** http://localhost:5000/logo

## 📝 Notes

- Le port par défaut est 5000
- Si le port 5000 est occupé, le système utilisera automatiquement le prochain port libre
- Le navigateur s'ouvrira automatiquement après le démarrage
