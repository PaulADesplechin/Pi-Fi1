# ⚡ Démarrage Rapide - Pifi

## 🚀 En 3 étapes

### 1. Installation
```bash
cd pifi
npm install
cd server && npm install && cd ..
```

### 2. Configuration (optionnel)
Créez un fichier `.env` :
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
SERVER_PORT=3001
JWT_SECRET=changez-moi-en-production
```

### 3. Lancement

**Windows** : Double-cliquez sur `DEMARRER.bat`

**Linux/Mac** :
```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend  
npm run dev
```

## ✅ C'est tout !

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend : http://localhost:3001

## 🎯 Première utilisation

1. Ouvrez http://localhost:3000
2. Explorez les pages dans le menu
3. Créez votre première alerte dans "Alertes"
4. Testez l'assistant IA

## 📚 Documentation complète

Voir `README.md` et `GUIDE_INSTALLATION.md` pour plus de détails.

---

**Bon développement ! 🚀**

