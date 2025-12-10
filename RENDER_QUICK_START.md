# ⚡ Déploiement Rapide sur Render

## 🚀 En 5 Minutes

### 1️⃣ Préparer GitHub
```bash
cd pifi
git init
git add .
git commit -m "Pifi app ready for Render"
git remote add origin https://github.com/votre-username/pifi.git
git push -u origin main
```

### 2️⃣ Déployer le Backend

1. Allez sur https://dashboard.render.com
2. **New +** → **Web Service**
3. Connectez GitHub → Sélectionnez repo **pifi**
4. Configuration :
   - **Name** : `pifi-backend`
   - **Build Command** : `cd server && npm install`
   - **Start Command** : `cd server && npm start`
   - **Plan** : Free

5. Variables d'environnement :
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=changez-moi-en-production
   FRONTEND_URL=https://pifi-frontend.onrender.com
   ```

6. **Create Web Service**
7. Notez l'URL : `https://pifi-backend.onrender.com`

### 3️⃣ Déployer le Frontend

1. **New +** → **Web Service**
2. Même repo **pifi**
3. Configuration :
   - **Name** : `pifi-frontend`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
   - **Plan** : Free

4. Variables d'environnement :
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://pifi-backend.onrender.com
   PORT=3000
   ```

5. **Create Web Service**

### 4️⃣ Mettre à jour le Backend

1. Retournez au backend
2. Mettez à jour `FRONTEND_URL` avec l'URL du frontend
3. **Manual Deploy** → **Deploy latest commit**

### ✅ C'est fait !

- Backend : `https://pifi-backend.onrender.com`
- Frontend : `https://pifi-frontend.onrender.com`

---

**Voir DEPLOIEMENT_RENDER.md pour le guide complet**

