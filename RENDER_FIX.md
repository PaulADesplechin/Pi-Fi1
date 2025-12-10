# 🔧 Corrections pour le Déploiement Render

## ✅ Corrections Appliquées

### 1. Configuration Node.js
- ✅ Ajout de `.nvmrc` pour spécifier Node.js 18.20.0
- ✅ Ajout de `engines` dans `package.json` pour garantir la version Node.js

### 2. Configuration Render
- ✅ Correction de `startCommand` pour le backend
- ✅ URLs mises à jour pour les services

### 3. Dépendances
- ✅ Vérification des dépendances dans `package.json`

---

## 📋 Instructions de Déploiement

### Option 1 : Utiliser render.yaml (Recommandé)

1. **Sur Render Dashboard** :
   - Allez sur https://dashboard.render.com
   - Cliquez sur **"New +"** → **"Blueprint"**
   - Connectez votre repo GitHub
   - Sélectionnez la branche `pifi-app`
   - Render détectera automatiquement `render.yaml`

2. **Configuration automatique** :
   - Render créera 2 services automatiquement :
     - `pifi-backend` (port 3001)
     - `pifi-frontend` (port 3000)

3. **Variables d'environnement** :
   - Le backend nécessite :
     - `JWT_SECRET` (généré automatiquement)
     - `FRONTEND_URL` (mis à jour après déploiement frontend)
   - Le frontend nécessite :
     - `NEXT_PUBLIC_API_URL` (URL du backend)

---

### Option 2 : Création Manuelle

#### Backend

1. **New +** → **Web Service**
2. Configuration :
   - **Name** : `pifi-backend`
   - **Repository** : Votre repo GitHub
   - **Branch** : `pifi-app`
   - **Root Directory** : `server`
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `node index.js`
   - **Node Version** : `18.20.0` (ou laissez vide pour auto-détection)

3. **Variables d'environnement** :
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=votre-secret-changez-moi
   FRONTEND_URL=https://pifi-frontend.onrender.com
   ```

#### Frontend

1. **New +** → **Web Service**
2. Configuration :
   - **Name** : `pifi-frontend`
   - **Repository** : Votre repo GitHub
   - **Branch** : `pifi-app`
   - **Root Directory** : (laisser vide)
   - **Environment** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
   - **Node Version** : `18.20.0`

3. **Variables d'environnement** :
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://pifi-backend.onrender.com
   PORT=3000
   ```

---

## 🔍 Vérification

### Backend
1. Attendez que le build se termine
2. Vérifiez les logs pour les erreurs
3. Testez : `https://pifi-backend.onrender.com/health`
4. Devrait retourner : `{"status":"ok","timestamp":"..."}`

### Frontend
1. Attendez que le build se termine (peut prendre 5-10 minutes)
2. Vérifiez les logs pour les erreurs
3. Testez : `https://pifi-frontend.onrender.com`
4. L'application devrait s'afficher

---

## 🐛 Dépannage

### Erreur "Build failed"
- Vérifiez que Node.js 18+ est utilisé
- Vérifiez les logs de build pour les erreurs spécifiques
- Assurez-vous que toutes les dépendances sont dans `package.json`

### Erreur "Port already in use"
- Render gère automatiquement les ports
- Assurez-vous d'utiliser `process.env.PORT` dans le code

### Erreur "Module not found"
- Vérifiez que toutes les dépendances sont listées dans `package.json`
- Vérifiez que le `buildCommand` installe bien les dépendances

### Frontend ne se connecte pas au backend
- Vérifiez que `NEXT_PUBLIC_API_URL` pointe vers le bon backend
- Vérifiez que le backend est bien démarré
- Vérifiez les CORS dans le backend

### Health check échoue
- Vérifiez que la route `/health` existe dans le backend
- Vérifiez que le serveur démarre correctement

---

## 📝 Notes Importantes

1. **Premier déploiement** : Le frontend peut prendre 10-15 minutes pour builder
2. **Free tier** : Les services peuvent s'endormir après 15 minutes d'inactivité
3. **Variables d'environnement** : Mettez à jour `FRONTEND_URL` après le déploiement du frontend
4. **Auto-deploy** : Render redéploie automatiquement à chaque push sur la branche surveillée

---

**Après ces corrections, le déploiement devrait fonctionner ! 🚀**

