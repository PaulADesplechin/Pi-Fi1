# 🚀 Pifi - Alertes Crypto & Actions avec Assistant IA

Application moderne d'alertes automatiques sur les cryptomonnaies et actions avec assistant IA intégré.

## ✨ Fonctionnalités

- 🔔 **Alertes automatiques** : Notifications instantanées dès 3-5% de variation
- 💰 **Suivi Crypto & Actions** : Prix en temps réel avec graphiques animés
- 🤖 **Assistant IA** : Coach financier quotidien pour comprendre les tendances
- 🔗 **Liens d'achat directs** : Accès rapide vers Binance, Kraken
- 📱 **PWA** : Installation sur mobile et desktop
- 🎨 **Design moderne** : Thème sombre avec effets néon discrets

## 🛠️ Technologies

### Frontend
- Next.js 15
- React 18
- TypeScript
- TailwindCSS
- Framer Motion (animations)
- Recharts (graphiques)
- Socket.io Client (WebSockets)

### Backend
- Node.js
- Express
- Socket.io (WebSockets)
- JWT (authentification)
- CoinGecko API (cryptomonnaies)
- OpenAI API (assistant IA)

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- MongoDB (optionnel pour la production)

### Étapes

1. **Cloner le projet**
```bash
cd pifi
```

2. **Installer les dépendances frontend**
```bash
npm install
```

3. **Installer les dépendances backend**
```bash
cd server
npm install
cd ..
```

4. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine :
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
SERVER_PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
OPENAI_API_KEY=your-openai-api-key (optionnel)
COINGECKO_API_KEY= (optionnel)
```

5. **Démarrer le backend**
```bash
cd server
npm start
```

Dans un autre terminal :

6. **Démarrer le frontend**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🚀 Démarrage Rapide

### Script Windows (DEMARRER.bat)
```batch
@echo off
echo Démarrage de Pifi...
start cmd /k "cd server && npm start"
timeout /t 3
start cmd /k "npm run dev"
```

### Script Linux/Mac
```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend
npm run dev
```

## 📁 Structure du Projet

```
pifi/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Page Dashboard
│   ├── crypto/            # Page Cryptomonnaies
│   ├── stocks/            # Page Actions
│   ├── alerts/            # Page Alertes
│   ├── assistant/         # Page Assistant IA
│   ├── settings/          # Page Paramètres
│   └── about/             # Page À propos
├── components/            # Composants React
│   ├── layout/            # Navbar, Footer
│   └── providers/         # Context providers
├── server/                # Backend Express
│   ├── routes/           # Routes API
│   ├── services/         # Services (alertes)
│   └── middleware/       # Middleware (auth)
├── public/               # Assets statiques
│   ├── logo-circle.svg   # Logo circulaire
│   └── logo-rectangle.svg # Logo rectangulaire
└── package.json          # Dépendances frontend
```

## 🔔 Système d'Alertes

Le système vérifie automatiquement toutes les 30 secondes les variations de prix et envoie des alertes via WebSocket si :
- La variation atteint le seuil configuré (3% ou 5%)
- La direction correspond à la configuration (hausse, baisse, ou les deux)

### Configuration d'une alerte
1. Aller dans la page "Alertes"
2. Cliquer sur "Nouvelle Alerte"
3. Choisir le type (Crypto ou Action)
4. Entrer le symbole (ex: BTC, ETH, AAPL)
5. Définir le seuil (3% ou 5%)
6. Choisir la direction (Hausse, Baisse, ou les deux)

## 🤖 Assistant IA

L'assistant IA utilise OpenAI GPT pour répondre aux questions sur :
- Les cryptomonnaies et leur fonctionnement
- Les tendances du marché
- Les concepts financiers
- Les explications des mouvements de prix

**Note** : L'assistant ne donne pas de conseils d'investissement spécifiques, seulement des informations éducatives.

## 🎨 Personnalisation

### Couleurs du thème
Modifiez `tailwind.config.ts` pour changer les couleurs :
- `electric-blue` : #00d4ff
- `dark-bg` : #0a0e27
- `dark-surface` : #0f1629

### Logo
Remplacez les fichiers SVG dans `/public` :
- `logo-circle.svg` : Logo circulaire
- `logo-rectangle.svg` : Logo rectangulaire

## 📱 PWA

L'application est configurée comme PWA. Pour installer :
1. Ouvrir dans Chrome/Edge
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. L'application sera installée et accessible hors ligne (fonctionnalités de base)

## 🚢 Déploiement

### Vercel (Frontend)
1. Connecter votre repo GitHub
2. Configurer les variables d'environnement
3. Déployer

### Render (Backend)
1. Créer un nouveau service Web
2. Connecter le repo
3. Configurer les variables d'environnement
4. Définir la commande de démarrage : `cd server && npm start`

## 🔒 Sécurité

- Authentification JWT
- Mots de passe hashés avec bcrypt
- Validation des données côté serveur
- CORS configuré
- Headers de sécurité HTTP

## 📝 API Endpoints

### Crypto
- `GET /api/crypto/prices` - Liste des prix crypto
- `GET /api/crypto/:symbol` - Prix d'une crypto spécifique

### Actions
- `GET /api/stocks/prices` - Liste des prix actions
- `GET /api/stocks/:symbol` - Prix d'une action spécifique

### Alertes
- `GET /api/alerts` - Liste des alertes utilisateur
- `POST /api/alerts` - Créer une alerte
- `PATCH /api/alerts/:id` - Modifier une alerte
- `DELETE /api/alerts/:id` - Supprimer une alerte

### Assistant
- `POST /api/assistant/chat` - Chat avec l'assistant IA

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

## 🐛 Dépannage

### Le serveur ne démarre pas
- Vérifier que le port 3001 n'est pas utilisé
- Vérifier les variables d'environnement

### Les alertes ne fonctionnent pas
- Vérifier que le serveur WebSocket est démarré
- Vérifier la connexion dans la console du navigateur

### Les prix ne se chargent pas
- Vérifier la connexion internet
- Vérifier les limites de l'API CoinGecko (rate limit)

## 📄 Licence

MIT License - Libre d'utilisation

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📧 Contact

Pour toute question : contact@pifi.app

---

**Fait avec ❤️ par l'équipe Pifi**

