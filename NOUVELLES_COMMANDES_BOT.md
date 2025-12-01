# 🤖 NOUVELLES COMMANDES AJOUTÉES AU BOT TELEGRAM

## ✅ Commandes Ajoutées

### 1. `/balance <adresse_ETH>`
**Description:** Vérifie le solde ETH d'un wallet Ethereum

**Usage:**
```
/balance 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**Fonctionnalités:**
- ✅ Validation de l'adresse Ethereum
- ✅ Récupération du solde en ETH
- ✅ Conversion en USD (si prix ETH disponible)
- ✅ Affichage formaté avec emojis

**Exemple de réponse:**
```
💰 Balance du Wallet

📍 Adresse: 0x742d35C...5f0bEb

💎 0.123456 ETH
💵 $456.78 USD
```

---

### 2. `/alert <id_token_coingecko>`
**Description:** Active une alerte pour un token. Le bot surveille le token et vous alerte lors de variations ≥ 5%

**Usage:**
```
/alert bitcoin
/alert ethereum
/alert solana
```

**Fonctionnalités:**
- ✅ Vérification que le token existe
- ✅ Stockage du dernier prix pour chaque utilisateur
- ✅ Surveillance automatique toutes les 30 secondes
- ✅ Alerte lors de variations ≥ 5% (hausse ou baisse)
- ✅ Calcul de variation depuis le dernier prix connu

**Exemple de réponse:**
```
✅ Alerte activée pour BITCOIN

💵 Prix actuel: $91,360.01
📊 Variation 24h: +1.07%

🔔 Vous serez alerté lors de variations ≥ 5%

💡 Pour désactiver: /alert_remove bitcoin
```

**Exemple d'alerte reçue:**
```
⚠️ ALERTE BITCOIN 📈 +5%

Prix: $95,928.01
Variation: +5.00%
Variation 24h: +1.07%
```

---

### 3. `/alert_remove <id_token_coingecko>`
**Description:** Retire une alerte pour un token

**Usage:**
```
/alert_remove bitcoin
/alert_remove ethereum
```

**Fonctionnalités:**
- ✅ Retire l'alerte du système
- ✅ Nettoie les données de suivi
- ✅ Confirmation de la suppression

---

## 🔧 Améliorations du Système

### Surveillance Automatique
- ✅ Vérification toutes les **30 secondes** (au lieu de 60)
- ✅ Surveillance individuelle par utilisateur
- ✅ Calcul de variation depuis le dernier prix connu
- ✅ Alertes pour variations ≥ 5% (hausse ou baisse)

### Intégration avec le Dashboard
- ✅ Les alertes sont synchronisées avec `shared_data`
- ✅ Les utilisateurs sont ajoutés automatiquement
- ✅ Compatible avec le système existant

---

## 📋 Commandes Complètes du Bot

### Commandes Principales
- `/start` - Menu principal interactif
- `/price <token>` - Prix d'un token
- `/balance <adresse>` - **NOUVEAU** - Solde ETH d'un wallet
- `/alert <token>` - **NOUVEAU** - Activer une alerte
- `/alert_remove <token>` - **NOUVEAU** - Retirer une alerte
- `/addwallet <adresse>` - Ajouter un wallet
- `/rugpull <adresse>` - Vérifier rugpull
- `/sniper` - Nouveaux tokens

---

## 🚀 Utilisation

### Pour utiliser `/balance`:
1. Obtenez une clé API Etherscan sur https://etherscan.io/apis
2. Ajoutez `ETHERSCAN_API_KEY=votre_cle` dans votre fichier `.env`
3. Utilisez `/balance 0x...` avec une adresse Ethereum valide

### Pour utiliser `/alert`:
1. Utilisez `/alert bitcoin` (ou n'importe quel token CoinGecko)
2. Le bot surveillera automatiquement le token
3. Vous recevrez une alerte lors de variations ≥ 5%
4. Utilisez `/alert_remove bitcoin` pour arrêter les alertes

---

## ⚙️ Configuration Requise

### Variables d'environnement (`.env`):
```env
TELEGRAM_BOT_TOKEN=votre_token_telegram
ETHERSCAN_API_KEY=votre_cle_etherscan  # Optionnel pour /balance
```

### Dépendances:
Toutes les dépendances sont déjà dans `requirements.txt`:
- `python-telegram-bot[job-queue]>=20.8`
- `requests==2.31.0`
- `python-dotenv==1.0.0`

---

## 📝 Notes

- Les alertes fonctionnent automatiquement en arrière-plan
- La surveillance se fait toutes les 30 secondes
- Les variations sont calculées depuis le dernier prix connu pour chaque utilisateur
- Compatible avec toutes les fonctionnalités existantes du bot

---

**Date d'ajout:** $(Get-Date -Format "yyyy-MM-dd")
**Statut:** ✅ Intégré et fonctionnel

