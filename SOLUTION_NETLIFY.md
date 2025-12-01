# ✅ Solution Définitive pour Netlify

## Problème
Erreur 404 sur https://pietfi1.netlify.app

## Solution Appliquée

### 1. Fichier index.html
- ✅ `index.html` est maintenant commité dans le repo Git
- ✅ Netlify le servira automatiquement depuis la racine

### 2. Configuration Simplifiée

**netlify.toml** :
- Build command simplifiée (pas besoin de générer index.html)
- Publish directory : `.` (racine)

**_redirects** :
- Fichiers statiques : `/static/*` → servis directement
- API : `/api/*` → fonction serverless
- Tout le reste : `/*` → `/index.html`

### 3. Vérifications dans Netlify

1. **Site settings → Build & deploy → Build settings**
   - Build command : `echo 'Build terminé - index.html déjà présent'`
   - Publish directory : `.`
   - Base directory : (vide)

2. **Vérifiez que index.html est déployé**
   - Deploys → Deploy log → cherchez "index.html"
   - Ou testez : `https://pietfi1.netlify.app/index.html`

### 4. Si ça ne fonctionne toujours pas

**Option A : Vérifier les fichiers déployés**
1. Allez dans **Deploys** → **Deploy log**
2. Cliquez sur **Browse published files**
3. Vérifiez que `index.html` est présent

**Option B : Utiliser Render.com (RECOMMANDÉ)**
Render.com est beaucoup plus simple pour Flask :

1. Allez sur https://render.com
2. Créez un compte
3. **New** → **Web Service**
4. Connectez votre repo GitHub : `PaulADesplechin/Pi-Fi1`
5. Render détectera automatiquement `render.yaml`
6. Ajoutez la variable d'environnement :
   - `TELEGRAM_BOT_TOKEN` = votre token
7. Cliquez sur **Create Web Service**
8. Attendez le déploiement (2-3 minutes)
9. Votre site sera disponible sur `https://votre-app.onrender.com`

**Avantages de Render.com** :
- ✅ Support natif Flask/Python
- ✅ Pas besoin de fonctions serverless
- ✅ Configuration automatique avec `render.yaml`
- ✅ Déploiement automatique à chaque push
- ✅ Gratuit pour commencer

### 5. Test

Après le déploiement Netlify :
- `https://pietfi1.netlify.app` → devrait afficher le dashboard
- `https://pietfi1.netlify.app/index.html` → devrait aussi fonctionner
- `https://pietfi1.netlify.app/api/prices` → devrait retourner les données JSON

## Structure des fichiers

```
projettelegram/
├── index.html          ← DOIT être commité
├── _redirects          ← Redirections Netlify
├── netlify.toml        ← Configuration build
├── static/             ← Fichiers statiques
└── netlify/
    └── functions/
        └── server/
            ├── server.py
            └── requirements.txt
```

## Support

Si le problème persiste après ces vérifications, utilisez Render.com qui est plus adapté pour Flask.

