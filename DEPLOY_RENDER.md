# 🚀 Déploiement sur Render.com - SOLUTION RECOMMANDÉE

## Pourquoi Render.com ?

Netlify Functions pour Python/Flask est complexe et peut avoir des limitations. **Render.com est spécialement conçu pour Flask** et beaucoup plus simple.

## Étapes de Déploiement

### 1. Créer un compte Render.com

1. Allez sur https://render.com
2. Cliquez sur **"Get Started for Free"**
3. Créez un compte (gratuit) avec GitHub

### 2. Créer un nouveau Web Service

1. Dans le dashboard Render, cliquez sur **"New +"**
2. Sélectionnez **"Web Service"**
3. Connectez votre repository GitHub : `PaulADesplechin/Pi-Fi1`
4. Render détectera automatiquement le fichier `render.yaml`

### 3. Configuration Automatique

Render détectera automatiquement :
- ✅ Python 3.11
- ✅ Build command : `pip install -r requirements.txt`
- ✅ Start command : `python run.py`

### 4. Variables d'Environnement

Dans **Environment**, ajoutez :
- **Key** : `TELEGRAM_BOT_TOKEN`
- **Value** : `8472604934:AAFcRXynmy2MKxRx4KbIAYGGtutijku5_H0`

(Optionnel) :
- **Key** : `ETHERSCAN_API_KEY`
- **Value** : votre clé Etherscan

### 5. Créer le Service

1. Cliquez sur **"Create Web Service"**
2. Attendez 2-3 minutes pour le déploiement
3. Votre site sera disponible sur `https://votre-app.onrender.com`

## Avantages de Render.com

✅ **Support natif Flask** - Pas besoin de fonctions serverless  
✅ **Configuration automatique** - Détecte `render.yaml`  
✅ **Déploiement automatique** - À chaque push sur GitHub  
✅ **Gratuit pour commencer** - Plan gratuit disponible  
✅ **Logs en temps réel** - Facile à déboguer  
✅ **HTTPS automatique** - Certificat SSL inclus  

## Vérification

Après le déploiement :
1. Visitez votre URL Render (format : `https://votre-app.onrender.com`)
2. Le dashboard devrait s'afficher correctement
3. Les données crypto devraient se charger automatiquement

## Support

Si vous avez des problèmes :
1. Vérifiez les **Logs** dans le dashboard Render
2. Vérifiez que `TELEGRAM_BOT_TOKEN` est bien configuré
3. Vérifiez que le service est **Running** (pas "Failed")

## Migration depuis Netlify

Si vous voulez garder Netlify ET Render :
- Netlify : pour le frontend statique (si vous le souhaitez)
- Render : pour l'application Flask complète (RECOMMANDÉ)

Ou simplement utilisez Render.com pour tout - c'est plus simple !

