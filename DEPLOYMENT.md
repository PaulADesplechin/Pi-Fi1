# 🚀 Guide de Déploiement

## Configuration GitHub Actions + Render.com

### Étape 1 : Configurer Render.com

1. Créez un compte sur [Render.com](https://render.com)
2. Créez un nouveau **Web Service**
3. Connectez votre repository GitHub
4. Render détectera automatiquement `render.yaml` et configurera le service

### Étape 2 : Obtenir le Deploy Hook URL (optionnel mais recommandé)

1. Dans Render.com, allez dans votre service
2. Cliquez sur **Settings**
3. Faites défiler jusqu'à **Deploy Hook**
4. Cliquez sur **Create Deploy Hook**
5. Copiez l'URL générée (format: `https://api.render.com/deploy/srv-xxxxx?key=xxxxx`)

### Étape 3 : Configurer le secret GitHub

1. Allez sur votre repository GitHub
2. Cliquez sur **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **New repository secret**
4. Nom : `RENDER_DEPLOY_HOOK_URL`
5. Valeur : Collez l'URL du Deploy Hook copiée à l'étape 2
6. Cliquez sur **Add secret**

### Étape 4 : Variables d'environnement sur Render.com

Dans Render.com, ajoutez ces variables d'environnement :

- `TELEGRAM_BOT_TOKEN` = `8472604934:AAFcRXynmy2MKxRx4KbIAYGGtutijku5_H0`
- `ETHERSCAN_API_KEY` = (optionnel, votre clé Etherscan)

### Étape 5 : Tester le déploiement

1. Faites un commit et poussez sur la branche `main` ou `master`
2. Le workflow GitHub Actions se déclenchera automatiquement
3. Vérifiez l'onglet **Actions** sur GitHub pour voir le statut
4. Le déploiement sur Render.com sera déclenché automatiquement

## 📋 Workflows GitHub Actions

### CI Workflow (`.github/workflows/ci.yml`)

- ✅ Vérifie la syntaxe Python
- ✅ Installe les dépendances
- ✅ Exécute des tests de linting
- ✅ Valide les fichiers de configuration

**Déclenchement** : À chaque push ou pull request

### Deploy Workflow (`.github/workflows/deploy.yml`)

- 🚀 Déclenche le déploiement sur Render.com
- 📝 Utilise le webhook Render si configuré
- ✅ Notifie le statut du déploiement

**Déclenchement** : À chaque push sur `main` ou `master`

## 🔍 Vérification

Après le déploiement :

1. Vérifiez les logs sur Render.com
2. Testez le bot sur Telegram avec `/start`
3. Vérifiez que les commandes fonctionnent correctement

## 🐛 Dépannage

### Le workflow ne se déclenche pas

- Vérifiez que vous avez poussé sur `main` ou `master`
- Vérifiez l'onglet **Actions** sur GitHub

### Le déploiement échoue

- Vérifiez les logs sur Render.com
- Vérifiez que toutes les variables d'environnement sont configurées
- Vérifiez que le token Telegram est valide

### Le bot ne répond pas

- Vérifiez que le service est en cours d'exécution sur Render.com
- Vérifiez les logs pour les erreurs
- Testez le token Telegram avec `/start`

