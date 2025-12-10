# 🚀 Guide de Déploiement sur Render

## 📋 Prérequis

1. Compte Render (gratuit) : https://render.com
2. Compte GitHub (pour connecter le repo)
3. Le projet Pifi prêt

---

## 🔧 ÉTAPE 1 : Préparer le Repository GitHub

### 1.1 Créer un repository GitHub
```bash
cd pifi
git init
git add .
git commit -m "Initial commit - Pifi application"
```

### 1.2 Pousser sur GitHub
- Créez un nouveau repo sur GitHub
- Connectez votre repo local :
```bash
git remote add origin https://github.com/votre-username/pifi.git
git push -u origin main
```

---

## 🌐 ÉTAPE 2 : Déployer le Backend sur Render

### 2.1 Créer un nouveau Web Service
1. Allez sur https://dashboard.render.com
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre repository GitHub
4. Sélectionnez le repo **pifi**

### 2.2 Configuration du Backend
- **Name** : `pifi-backend`
- **Environment** : `Node`
- **Build Command** : `cd server && npm install`
- **Start Command** : `cd server && npm start`
- **Plan** : `Free` (ou `Starter` pour plus de ressources)

### 2.3 Variables d'Environnement
Ajoutez ces variables dans l'onglet **"Environment"** :

```
NODE_ENV=production
PORT=3001
JWT_SECRET=votre-secret-super-securise-changez-moi
FRONTEND_URL=https://votre-frontend-url.onrender.com
OPENAI_API_KEY=votre-cle-openai (optionnel)
COINGECKO_API_KEY= (optionnel)
```

### 2.4 Déployer
- Cliquez sur **"Create Web Service"**
- Render va automatiquement :
  - Installer les dépendances
  - Builder l'application
  - Démarrer le serveur

### 2.5 Obtenir l'URL du Backend
Une fois déployé, vous obtiendrez une URL comme :
```
https://pifi-backend.onrender.com
```

---

## 🎨 ÉTAPE 3 : Déployer le Frontend sur Render

### 3.1 Créer un nouveau Web Service
1. Cliquez sur **"New +"** → **"Web Service"**
2. Sélectionnez le même repository **pifi**

### 3.2 Configuration du Frontend
- **Name** : `pifi-frontend`
- **Environment** : `Node`
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm start`
- **Plan** : `Free`

### 3.3 Variables d'Environnement
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://pifi-backend.onrender.com
PORT=3000
```

### 3.4 Déployer
- Cliquez sur **"Create Web Service"**
- Attendez le déploiement

---

## 🔄 ÉTAPE 4 : Mettre à jour les URLs

### 4.1 Mettre à jour le Backend
Une fois le frontend déployé, mettez à jour la variable `FRONTEND_URL` du backend :
```
FRONTEND_URL=https://pifi-frontend.onrender.com
```

### 4.2 Redéployer le Backend
- Allez dans les paramètres du backend
- Mettez à jour `FRONTEND_URL`
- Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**

---

## ✅ ÉTAPE 5 : Vérification

### 5.1 Vérifier le Backend
Ouvrez dans votre navigateur :
```
https://pifi-backend.onrender.com/health
```
Vous devriez voir : `{"status":"ok","timestamp":"..."}`

### 5.2 Vérifier le Frontend
Ouvrez dans votre navigateur :
```
https://pifi-frontend.onrender.com
```
L'application devrait s'afficher !

---

## 🎯 ALTERNATIVE : Frontend sur Vercel (Recommandé)

### Pourquoi Vercel pour le Frontend ?
- Optimisé pour Next.js
- Déploiement plus rapide
- CDN global
- Gratuit avec de meilleures performances

### Déploiement sur Vercel :

1. **Installer Vercel CLI** :
```bash
npm i -g vercel
```

2. **Se connecter** :
```bash
vercel login
```

3. **Déployer** :
```bash
cd pifi
vercel
```

4. **Configurer les variables** :
- Allez sur https://vercel.com/dashboard
- Sélectionnez votre projet
- Allez dans **Settings** → **Environment Variables**
- Ajoutez :
  ```
  NEXT_PUBLIC_API_URL=https://pifi-backend.onrender.com
  ```

5. **Redéployer** :
```bash
vercel --prod
```

---

## 📝 Configuration Recommandée

### Architecture Recommandée :
- **Backend** : Render (Web Service)
- **Frontend** : Vercel (optimisé Next.js)
- **Base de données** : MongoDB Atlas (gratuit) ou Render PostgreSQL

### URLs Finales :
- Backend : `https://pifi-backend.onrender.com`
- Frontend : `https://pifi.vercel.app` (ou votre domaine)

---

## 🔧 Dépannage

### Le backend ne démarre pas
- Vérifiez les logs dans Render Dashboard
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez que le port est correct (3001)

### Le frontend ne se connecte pas au backend
- Vérifiez que `NEXT_PUBLIC_API_URL` pointe vers le bon backend
- Vérifiez les CORS dans le backend
- Vérifiez que le backend est bien démarré

### Erreurs de build
- Vérifiez les logs de build dans Render
- Assurez-vous que toutes les dépendances sont dans `package.json`
- Vérifiez que Node.js version est compatible

---

## 💡 Astuces

1. **Health Checks** : Render vérifie automatiquement `/health`
2. **Auto-deploy** : Chaque push sur GitHub déclenche un redéploiement
3. **Logs** : Consultez les logs en temps réel dans Render Dashboard
4. **Variables sensibles** : Utilisez les variables d'environnement, jamais de secrets dans le code

---

## ✅ Checklist de Déploiement

- [ ] Repository GitHub créé et poussé
- [ ] Backend déployé sur Render
- [ ] Variables d'environnement backend configurées
- [ ] Frontend déployé (Render ou Vercel)
- [ ] Variables d'environnement frontend configurées
- [ ] URLs mises à jour
- [ ] Health check backend OK
- [ ] Application frontend accessible
- [ ] Connexion frontend-backend fonctionnelle

---

**Votre application Pifi est maintenant en ligne ! 🚀**

