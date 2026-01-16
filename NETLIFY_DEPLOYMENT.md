# 🌐 Guide de Déploiement Netlify

## Configuration pour https://pietfi1.netlify.app

### Étape 1 : Connecter le dépôt GitHub à Netlify

1. Allez sur [Netlify](https://app.netlify.com)
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Sélectionnez **GitHub** et autorisez Netlify
4. Choisissez le dépôt : `PaulADesplechin/Pi-Fi1`
5. Configurez les paramètres de build :
   - **Build command** : `pip install -r requirements.txt && mkdir -p netlify/functions`
   - **Publish directory** : `.` (point)
   - **Python version** : `3.11`

### Étape 2 : Variables d'environnement

Dans Netlify, allez dans **Site settings** → **Environment variables** et ajoutez :

```
TELEGRAM_BOT_TOKEN=8472604934:AAFcRXynmy2MKxRx4KbIAYGGtutijku5_H0
ETHERSCAN_API_KEY=votre_cle_etherscan (optionnel)
PORT=5000
```

### Étape 3 : Configuration automatique

Le fichier `netlify.toml` est déjà configuré avec :
- ✅ Redirections vers les fonctions serverless
- ✅ Headers de sécurité
- ✅ Cache pour les assets statiques
- ✅ Configuration des fonctions Python

### Étape 4 : Déploiement

1. Netlify détectera automatiquement le fichier `netlify.toml`
2. À chaque push sur GitHub, Netlify redéploiera automatiquement
3. Vérifiez les logs dans l'onglet **Deploys** de Netlify

### Étape 5 : Vérification

Après le déploiement :
1. Visitez https://pietfi1.netlify.app
2. Vérifiez que le dashboard s'affiche correctement
3. Testez les fonctionnalités (recherche, modals, etc.)

## 📋 Fichiers de configuration créés

- `netlify.toml` : Configuration principale Netlify
- `netlify/functions/server.py` : Fonction serverless pour Flask
- `_redirects` : Redirections Netlify
- `requirements.txt` : Mis à jour avec `serverless-wsgi`

## 🔧 Dépannage

### Le site ne se déploie pas
- Vérifiez les logs dans Netlify
- Assurez-vous que `serverless-wsgi` est dans `requirements.txt`
- Vérifiez que Python 3.11 est configuré

### Erreur 500 sur le site
- Vérifiez les logs de la fonction serverless dans Netlify
- Assurez-vous que toutes les variables d'environnement sont configurées
- Vérifiez que le token Telegram est valide

### Les assets statiques ne se chargent pas
- Vérifiez que le dossier `static/` est bien présent
- Vérifiez les redirections dans `netlify.toml`
- Vérifiez les headers de cache

## 🚀 Déploiement automatique

Netlify surveille automatiquement votre dépôt GitHub. À chaque push sur `master`, le site sera redéployé automatiquement.

## 📝 Notes importantes

- Netlify Functions a une limite de temps d'exécution (10 secondes pour le plan gratuit)
- Pour les applications Flask complexes, considérez Render.com ou Heroku
- Les fichiers statiques sont servis directement par Netlify (pas via Flask)

