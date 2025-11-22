# 🚀 Fonctionnalités du Bot Crypto Pro

## ✨ Nouvelles Fonctionnalités

### 1. 💰 Alertes Multi-Tokens (ETH/BTC/Tokens)
- ✅ Alertes automatiques pour ETH et BTC
- ✅ Suivi personnalisé de n'importe quel token
- ✅ Seuil d'alerte configurable (défaut: ±5%)
- ✅ Notifications en temps réel

**Commandes:**
- `/alert <token>` - Activer une alerte pour un token
- `/price <token>` - Voir le prix d'un token

### 2. 🎯 Sniper Tokens
- ✅ Détection automatique des nouveaux tokens (24h)
- ✅ Affichage de la liquidité et du volume
- ✅ Vérification rapide via le menu

**Utilisation:**
- Menu → Sniper Tokens
- Affiche les 5 derniers tokens créés

### 3. 🛡️ Détection Rugpull
- ✅ Analyse des indicateurs de risque
- ✅ Score de sécurité (0-100)
- ✅ Vérification de:
  - Liquidité verrouillée
  - Nombre de holders
  - Variations de prix suspectes
  - Liquidité totale

**Commandes:**
- `/rugpull <adresse_token>` - Vérifier un token
- Menu → Rugpull Check

### 4. 👛 Suivi de Wallet Complet
- ✅ Suivi de plusieurs wallets Ethereum
- ✅ Affichage du solde ETH
- ✅ Historique des transactions (via Etherscan)
- ✅ Alertes sur les mouvements

**Commandes:**
- `/addwallet <adresse>` - Ajouter un wallet
- Menu → Wallets

### 5. 📊 Dashboard Web
- ✅ Interface web moderne et responsive
- ✅ Statistiques en temps réel
- ✅ Graphiques de prix
- ✅ Liste des prix principaux
- ✅ Actualisation automatique (30s)

**Accès:**
- URL: `https://votre-bot.onrender.com/`
- API: `/api/data` et `/api/prices`

### 6. ⚡ Code Async Optimisé
- ✅ Utilisation de `httpx` pour les appels API async
- ✅ Requêtes parallèles pour plusieurs tokens
- ✅ Cache des prix (30 secondes)
- ✅ Meilleures performances

### 7. 🔒 Sécurité Améliorée
- ✅ Validation des adresses Ethereum
- ✅ Sanitization des entrées utilisateur
- ✅ Validation des IDs de tokens
- ✅ Protection contre les injections

**Classes de sécurité:**
- `SecurityValidator.validate_ethereum_address()`
- `SecurityValidator.sanitize_input()`
- `SecurityValidator.validate_token_id()`

### 8. 🎨 Interface Pro (Menu, Boutons, Inline Keyboard)
- ✅ Menu principal interactif
- ✅ Navigation par boutons inline
- ✅ Interface intuitive
- ✅ Retours visuels immédiats

**Navigation:**
- Menu principal avec 8 options
- Sous-menus pour chaque fonctionnalité
- Boutons de retour

## 📱 Commandes Disponibles

### Commandes Principales
- `/start` - Menu principal interactif
- `/price <token>` - Prix d'un token
- `/alert <token>` - Activer une alerte
- `/addwallet <adresse>` - Ajouter un wallet
- `/rugpull <adresse>` - Vérifier rugpull
- `/sniper` - Nouveaux tokens
- `/settings` - Paramètres

### Exemples
```
/price bitcoin
/alert ethereum
/addwallet 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
/rugpull 0x1234567890abcdef1234567890abcdef12345678
```

## 🏗️ Architecture

### Fichiers Principaux
- `bot_pro.py` - Bot Telegram principal (version améliorée)
- `dashboard.py` - Dashboard web Flask
- `run.py` - Lanceur pour bot + dashboard
- `bot.py` - Version originale (conservée pour compatibilité)

### Structure des Données
```python
user_settings = {user_id: {settings}}
tracked_tokens = {user_id: {token_id: last_price}}
tracked_wallets = {user_id: {wallet_addresses}}
alert_subscribers = {token_id: {user_ids}}
```

## 🔧 Configuration

### Variables d'Environnement
- `TELEGRAM_BOT_TOKEN` - Token du bot Telegram (requis)
- `ETHERSCAN_API_KEY` - Clé API Etherscan (optionnel)
- `PORT` - Port pour le dashboard (défaut: 5000)

### Paramètres Utilisateur
- Seuil d'alerte: 5% (configurable)
- Cache des prix: 30 secondes
- Intervalle de surveillance: 60 secondes

## 🚀 Déploiement

### Sur Render.com
1. Le fichier `render.yaml` est configuré
2. Utilise `run.py` pour lancer bot + dashboard
3. Le dashboard sera accessible sur l'URL Render

### Localement
```bash
python run.py
```

Le bot et le dashboard démarreront ensemble.

## 📈 Améliorations Futures

- [ ] Base de données pour persister les données
- [ ] Support multi-chaînes (BSC, Polygon, etc.)
- [ ] Graphiques avancés dans le dashboard
- [ ] Export des données (CSV, JSON)
- [ ] Notifications push personnalisées
- [ ] API REST complète
- [ ] Authentification pour le dashboard

