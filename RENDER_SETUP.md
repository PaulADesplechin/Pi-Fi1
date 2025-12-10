# 🚀 Configuration Render - Projet Pifi

## ✅ Code Poussé sur GitHub

Le code a été poussé sur la branche `pifi-app` :
- **Repo** : https://github.com/PaulADesplechin/Pi-Fi1.git
- **Branche** : `pifi-app`

---

## 📋 Configuration Render

### Option 1 : Utiliser render.yaml (Recommandé)

Render détectera automatiquement `render.yaml` et créera les services.

1. Allez sur https://dashboard.render.com
2. **New +** → **Blueprint**
3. Connectez le repo : `https://github.com/PaulADesplechin/Pi-Fi1.git`
4. Sélectionnez la branche : `pifi-app`
5. Render créera automatiquement :
   - `pifi-backend` (Web Service)
   - `pifi-frontend` (Web Service)

### Option 2 : Créer Manuellement

#### Backend Service

1. **New +** → **Web Service**
2. Connectez le repo GitHub
3. Configuration :
   - **Name** : `pifi-backend`
   - **Branch** : `pifi-app`
   - **Root Directory** : (laisser vide)
   - **Environment** : `Node`
   - **Build Command** : `cd server && npm install`
   - **Start Command** : `cd server && npm start`

4. Variables d'environnement :
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=votre-secret-changez-moi
   FRONTEND_URL=https://pifi-frontend.onrender.com
   OPENAI_API_KEY= (optionnel)
   COINGECKO_API_KEY= (optionnel)
   ```

5. **Create Web Service**

#### Frontend Service

1. **New +** → **Web Service**
2. Même repo GitHub
3. Configuration :
   - **Name** : `pifi-frontend`
   - **Branch** : `pifi-app`
   - **Root Directory** : (laisser vide)
   - **Environment** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`

4. Variables d'environnement :
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://pifi-backend.onrender.com
   PORT=3000
   ```

5. **Create Web Service**

---

## 🔄 Mise à Jour des URLs

Une fois le frontend déployé :

1. Retournez au backend sur Render
2. Mettez à jour `FRONTEND_URL` avec l'URL du frontend
3. **Manual Deploy** → **Deploy latest commit**

---

## ✅ Vérification

- Backend : `https://pifi-backend.onrender.com/health`
- Frontend : `https://pifi-frontend.onrender.com`

---

**Render déploiera automatiquement à chaque push sur `pifi-app` ! 🚀**

