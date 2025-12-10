# 🚀 Push sur Render - Instructions

## ✅ Code Prêt et Commité

Le code a été préparé et commité localement.

---

## 📤 ÉTAPES POUR PUSHER SUR RENDER

### Option 1 : Via GitHub (Recommandé)

#### 1. Créer/Connecter le Repo GitHub

```bash
cd pifi

# Si pas de remote GitHub
git remote add origin https://github.com/votre-username/pifi.git

# Pousser le code
git branch -M main
git push -u origin main
```

#### 2. Sur Render Dashboard

1. Allez sur https://dashboard.render.com
2. **New +** → **Blueprint** (si vous avez render.yaml)
   OU
   **New +** → **Web Service** (pour créer manuellement)

3. **Connect GitHub** → Sélectionnez votre repo `pifi`

4. Render détectera automatiquement `render.yaml` et créera :
   - `pifi-backend` (Web Service)
   - `pifi-frontend` (Web Service)

5. Configurez les variables d'environnement si nécessaire

6. **Create** → Render déploiera automatiquement !

---

### Option 2 : Push Direct (si Render est déjà configuré)

Si Render est déjà connecté à votre repo :

```bash
cd pifi
git add .
git commit -m "Update: Ready for Render"
git push
```

Render redéploiera automatiquement !

---

## 🔧 Configuration Render

### Backend Service
- **Build Command** : `cd server && npm install`
- **Start Command** : `cd server && npm start`
- **Health Check** : `/health`

### Frontend Service
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm start`

### Variables d'Environnement Requises

**Backend :**
```
NODE_ENV=production
PORT=3001
JWT_SECRET=votre-secret-changez-moi
FRONTEND_URL=https://pifi-frontend.onrender.com
```

**Frontend :**
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://pifi-backend.onrender.com
PORT=3000
```

---

## ✅ Vérification

Après le déploiement :

1. **Backend Health Check** :
   ```
   https://pifi-backend.onrender.com/health
   ```
   Devrait retourner : `{"status":"ok"}`

2. **Frontend** :
   ```
   https://pifi-frontend.onrender.com
   ```
   L'application devrait s'afficher !

---

## 🔄 Auto-Deploy

Render déploie automatiquement à chaque push sur la branche `main` !

Pour forcer un redéploiement :
- Render Dashboard → Votre service → **Manual Deploy** → **Deploy latest commit**

---

**Votre application sera en ligne en quelques minutes ! 🚀**

