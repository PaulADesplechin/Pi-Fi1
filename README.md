# 🤖 Bot Telegram Crypto Monitor

Bot Telegram pour surveiller les prix des cryptomonnaies avec alertes automatiques.

## ✨ Fonctionnalités

- 📊 **Surveillance ETH** : Surveille automatiquement le prix de l'ETH et alerte en cas de variation ±5%
- 💰 **Solde Wallet** : Vérifie le solde ETH d'un wallet Ethereum via `/walletbalance`
- 🪙 **Suivi de tokens** : Suit n'importe quel token crypto avec `/track_token`
- 🚨 **Alertes automatiques** : Notifications en temps réel des variations de prix

## 🚀 Installation

### 1. Créer un bot Telegram

1. Ouvrez Telegram et cherchez **@BotFather**
2. Envoyez `/newbot` et suivez les instructions
3. Copiez le token fourni (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Cloner et configurer

```bash
# Cloner le repository
git clone <votre-repo>
cd projettelegram

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env
cp .env.example .env

# Éditer .env et ajouter votre token
# TELEGRAM_BOT_TOKEN=votre_token_ici
```

### 3. (Optionnel) Obtenir une clé API Etherscan

Pour utiliser la commande `/walletbalance` :

1. Créez un compte sur [Etherscan.io](https://etherscan.io)
2. Allez dans [API-KEYs](https://etherscan.io/apis)
3. Créez une nouvelle clé API
4. Ajoutez-la dans `.env` : `ETHERSCAN_API_KEY=votre_cle_ici`

## 📱 Commandes disponibles

- `/start` - Démarrer le bot et voir les commandes
- `/help` - Afficher l'aide
- `/ethprice` - Afficher le prix actuel de l'ETH
- `/walletbalance <adresse>` - Vérifier le solde d'un wallet Ethereum
  - Exemple: `/walletbalance 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
- `/track_token <token_id>` - Suivre un token et recevoir des alertes
  - Exemples: `/track_token bitcoin`, `/track_token ethereum`, `/track_token cardano`
- `/stop_tracking` - Arrêter le suivi de tous vos tokens

## 🌐 Déploiement sur Render.com

### Méthode 1 : Via l'interface web

1. **Créer un compte** sur [Render.com](https://render.com) (gratuit)

2. **Créer un nouveau Web Service** :
   - Cliquez sur "New +" → "Web Service"
   - Connectez votre repository GitHub
   - Sélectionnez le repository `projettelegram`

3. **Configuration** :
   - **Name** : `telegram-crypto-bot` (ou votre choix)
   - **Environment** : `Python 3`
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `python bot.py`
   - **Plan** : Free

4. **Variables d'environnement** :
   - Cliquez sur "Environment" dans le menu
   - Ajoutez :
     - `TELEGRAM_BOT_TOKEN` = votre token Telegram
     - `ETHERSCAN_API_KEY` = votre clé Etherscan (optionnel)

5. **Déployer** :
   - Cliquez sur "Create Web Service"
   - Le bot sera déployé automatiquement

### Méthode 2 : Via render.yaml (recommandé)

Le fichier `render.yaml` est déjà configuré. Il suffit de :

1. Pousser le code sur GitHub
2. Dans Render.com, créer un nouveau "Blueprint" et connecter le repo
3. Render détectera automatiquement `render.yaml` et configurera le service

### Méthode 3 : Déploiement automatique avec GitHub Actions

Des workflows GitHub Actions sont configurés pour automatiser les tests et le déploiement :

1. **Workflow CI** (`.github/workflows/ci.yml`) :
   - Exécute des tests et vérifications à chaque push/PR
   - Vérifie la syntaxe Python
   - Valide les fichiers de configuration

2. **Workflow Deploy** (`.github/workflows/deploy.yml`) :
   - Déclenche automatiquement un déploiement sur Render.com après un push sur main/master
   - Optionnel : Configurez un webhook Render pour un déploiement immédiat :
     - Dans Render.com : Votre service → Settings → Deploy Hook
     - Copiez l'URL du webhook
     - Dans GitHub : Settings → Secrets → Actions → Ajoutez `RENDER_DEPLOY_HOOK_URL`

## 🔧 Développement local

```bash
# Installer les dépendances
pip install -r requirements.txt

# Lancer le bot
python bot.py
```

## 📝 Notes importantes

- Le bot vérifie les prix toutes les 60 secondes
- Les alertes sont envoyées uniquement si la variation dépasse ±5%
- Pour la commande `/walletbalance`, une clé API Etherscan est requise
- Les tokens suivis sont stockés en mémoire (perdus au redémarrage)
  - Pour la production, utilisez une base de données (PostgreSQL, MongoDB, etc.)

## 🛠️ Améliorations possibles

- [ ] Ajouter une base de données pour persister les tokens suivis
- [ ] Support de plusieurs cryptomonnaies pour la surveillance automatique
- [ ] Commandes pour configurer le seuil d'alerte personnalisé
- [ ] Graphiques de prix avec `/chart <token>`
- [ ] Support de plusieurs wallets par utilisateur
- [ ] Historique des prix

## 📄 Licence

MIT License - Libre d'utilisation

## 🤝 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

