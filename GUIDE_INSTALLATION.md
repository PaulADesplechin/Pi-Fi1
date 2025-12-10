# 📖 Guide d'Installation Complet - Pifi

## 🎯 Vue d'ensemble

Ce guide vous accompagne étape par étape pour installer et lancer Pifi sur votre machine.

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir :

1. **Node.js** (version 18 ou supérieure)
   - Télécharger depuis : https://nodejs.org
   - Vérifier l'installation : `node --version`

2. **npm** (inclus avec Node.js)
   - Vérifier : `npm --version`

3. **Git** (optionnel, pour cloner le repo)
   - Télécharger depuis : https://git-scm.com

## 🚀 Installation Rapide (Windows)

### Méthode 1 : Script automatique

1. Double-cliquez sur `DEMARRER.bat`
2. Attendez que les dépendances s'installent
3. L'application s'ouvrira automatiquement dans votre navigateur

### Méthode 2 : Installation manuelle

```bash
# 1. Installer les dépendances frontend
npm install

# 2. Installer les dépendances backend
cd server
npm install
cd ..

# 3. Démarrer le backend (Terminal 1)
cd server
npm start

# 4. Démarrer le frontend (Terminal 2)
npm run dev
```

## 🐧 Installation sur Linux/Mac

```bash
# 1. Installer les dépendances frontend
npm install

# 2. Installer les dépendances backend
cd server && npm install && cd ..

# 3. Démarrer le backend (Terminal 1)
cd server
npm start

# 4. Démarrer le frontend (Terminal 2)
npm run dev
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# URL de l'API backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Port du serveur backend
SERVER_PORT=3001

# Secret JWT (changez en production !)
JWT_SECRET=votre-secret-super-securise-changez-moi

# OpenAI API Key (optionnel, pour l'assistant IA)
OPENAI_API_KEY=votre-cle-openai-ici

# CoinGecko API Key (optionnel)
COINGECKO_API_KEY=
```

### Obtenir une clé OpenAI (optionnel)

1. Créer un compte sur https://platform.openai.com
2. Aller dans "API Keys"
3. Créer une nouvelle clé
4. Copier la clé dans votre `.env`

**Note** : L'application fonctionne sans clé OpenAI, mais l'assistant IA sera limité.

## 🔧 Dépannage

### Erreur : "Port 3000 already in use"

Le port 3000 est déjà utilisé. Solutions :

1. Arrêter l'autre application
2. Changer le port dans `package.json` :
   ```json
   "dev": "next dev -p 3002"
   ```

### Erreur : "Port 3001 already in use"

Le port du backend est occupé. Solutions :

1. Arrêter l'autre serveur
2. Changer le port dans `.env` :
   ```env
   SERVER_PORT=3002
   ```

### Erreur : "Module not found"

Les dépendances ne sont pas installées :

```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### Erreur : "Cannot find module 'socket.io'"

Installer les dépendances du serveur :

```bash
cd server
npm install
```

## 📱 Accès à l'application

Une fois démarrée, l'application est accessible sur :

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001
- **Health Check** : http://localhost:3001/health

## 🎨 Première utilisation

1. Ouvrez http://localhost:3000 dans votre navigateur
2. Explorez les différentes pages :
   - Dashboard : Vue d'ensemble
   - Crypto : Liste des cryptomonnaies
   - Actions : Liste des actions
   - Alertes : Configurez vos alertes
   - Assistant IA : Chat avec l'assistant
   - Paramètres : Personnalisez l'application

## 🔔 Configurer une alerte

1. Aller dans la page "Alertes"
2. Cliquer sur "Nouvelle Alerte"
3. Choisir :
   - Type : Crypto ou Action
   - Symbole : BTC, ETH, AAPL, etc.
   - Seuil : 3% ou 5%
   - Direction : Hausse, Baisse, ou les deux
4. Cliquer sur "Créer"

Les alertes sont vérifiées automatiquement toutes les 30 secondes.

## 🚢 Déploiement en production

### Vercel (Frontend)

1. Installer Vercel CLI : `npm i -g vercel`
2. Se connecter : `vercel login`
3. Déployer : `vercel`
4. Configurer les variables d'environnement dans le dashboard Vercel

### Render (Backend)

1. Créer un compte sur https://render.com
2. Créer un nouveau "Web Service"
3. Connecter votre repo GitHub
4. Configurer :
   - Build Command : `cd server && npm install`
   - Start Command : `cd server && npm start`
5. Ajouter les variables d'environnement

## 📞 Support

En cas de problème :

1. Vérifier les logs dans les terminaux
2. Vérifier que les ports ne sont pas utilisés
3. Vérifier les variables d'environnement
4. Consulter le README.md principal

## ✅ Checklist d'installation

- [ ] Node.js installé (v18+)
- [ ] Dépendances frontend installées
- [ ] Dépendances backend installées
- [ ] Fichier `.env` créé et configuré
- [ ] Backend démarré sur le port 3001
- [ ] Frontend démarré sur le port 3000
- [ ] Application accessible dans le navigateur
- [ ] Test de création d'alerte réussi

---

**Bon développement ! 🚀**

