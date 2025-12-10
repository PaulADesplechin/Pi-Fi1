# 🔧 Corrections pour Déploiement Render

## ✅ Corrections Appliquées

### 1. Configuration Render (`render.yaml`)
- ✅ Utilisation de `npm ci` au lieu de `npm install` pour builds reproductibles
- ✅ Ajout de `--production` pour le backend
- ✅ Variables d'environnement marquées comme optionnelles
- ✅ Health check configuré

### 2. Configuration Next.js (`next.config.js`)
- ✅ Ajout de `output: 'standalone'` pour meilleure compatibilité
- ✅ Configuration TypeScript et ESLint
- ✅ Images optimisées

### 3. Fichiers `.npmrc`
- ✅ Ajout de `legacy-peer-deps=true` pour éviter les conflits de dépendances

---

## 📋 Instructions de Déploiement

### Option 1 : Utiliser Blueprint (Recommandé)

1. **Sur Render Dashboard** :
   - Allez sur https://dashboard.render.com
   - Cliquez sur **"New +"** → **"Blueprint"**
   - Connectez votre repo GitHub : `https://github.com/PaulADesplechin/Pi-Fi1.git`
   - Sélectionnez la branche : `pifi-app`
   - Render détectera automatiquement `render.yaml`

2. **Render créera automatiquement** :
   - `pifi-backend` (port 3001)
   - `pifi-frontend` (port 3000)

3. **Variables d'environnement** :
   - Sont configurées automatiquement via `render.yaml`
   - `JWT_SECRET` sera généré automatiquement
   - `FRONTEND_URL` sera mis à jour après déploiement frontend

### Option 2 : Création Manuelle

#### Backend

1. **New +** → **Web Service**
2. Configuration :
   - **Name** : `pifi-backend`
   - **Repository** : Votre repo GitHub
   - **Branch** : `pifi-app`
   - **Root Directory** : `server`
   - **Environment** : `Node`
   - **Build Command** : `npm install --production`
   - **Start Command** : `node index.js`
   - **Node Version** : `18.20.0` (ou laissez vide)

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
   - **Build Command** : `npm ci && npm run build`
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
1. Attendez la fin du build (2-3 minutes)
2. Vérifiez les logs pour les erreurs
3. Testez : `https://pifi-backend.onrender.com/health`
4. Devrait retourner : `{"status":"ok","timestamp":"..."}`

### Frontend
1. Attendez la fin du build (5-10 minutes pour Next.js)
2. Vérifiez les logs pour les erreurs
3. Testez : `https://pifi-frontend.onrender.com`
4. L'application devrait s'afficher

---

## 🐛 Dépannage

### Erreur "Build failed"
- Vérifiez que Node.js 18+ est utilisé
- Vérifiez les logs de build pour les erreurs spécifiques
- Assurez-vous que toutes les dépendances sont dans `package.json`

### Erreur "Module not found"
- Vérifiez que `npm ci` est utilisé (plus fiable que `npm install`)
- Vérifiez que toutes les dépendances sont listées dans `package.json`
- Le fichier `.npmrc` devrait résoudre les conflits

### Erreur "Port already in use"
- Render gère automatiquement les ports via `process.env.PORT`
- Assurez-vous d'utiliser `process.env.PORT` dans le code

### Frontend ne se connecte pas au backend
- Vérifiez que `NEXT_PUBLIC_API_URL` pointe vers le bon backend
- Vérifiez que le backend est bien démarré
- Vérifiez les CORS dans le backend

### Build Next.js échoue
- Vérifiez que TypeScript compile sans erreurs
- Vérifiez que ESLint ne bloque pas le build
- Le mode `standalone` devrait améliorer la compatibilité

---

## 📝 Notes Importantes

1. **Premier déploiement** : Le frontend peut prendre 10-15 minutes pour builder
2. **Free tier** : Les services peuvent s'endormir après 15 minutes d'inactivité
3. **Variables d'environnement** : Mettez à jour `FRONTEND_URL` après le déploiement du frontend
4. **Auto-deploy** : Render redéploie automatiquement à chaque push sur la branche surveillée
5. **npm ci** : Utilise `package-lock.json` pour des builds reproductibles

---

**Après ces corrections, le déploiement devrait fonctionner ! 🚀**

