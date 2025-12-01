# 🔧 Guide de Correction Netlify

## Problème
L'erreur 404 sur Netlify indique que la fonction serverless n'est pas correctement détectée ou exécutée.

## Solution

### Structure des fichiers Netlify Functions Python

Pour que Netlify détecte correctement les fonctions Python, la structure doit être :

```
netlify/
  functions/
    server/
      server.py          # Le handler de la fonction
      requirements.txt   # Dépendances spécifiques à la fonction
```

### Configuration dans Netlify Dashboard

1. **Allez dans votre site Netlify** → **Site settings** → **Build & deploy**

2. **Build command** :
   ```
   pip install -r requirements.txt
   ```

3. **Publish directory** :
   ```
   .
   ```

4. **Variables d'environnement** :
   - `TELEGRAM_BOT_TOKEN` = votre token
   - `PYTHON_VERSION` = `3.11`

### Vérification

1. Vérifiez les **Deploy logs** dans Netlify
2. Cherchez les erreurs dans les logs de la fonction
3. Testez directement la fonction : `https://pietfi1.netlify.app/.netlify/functions/server`

### Alternative : Utiliser Render.com

Si Netlify continue à poser problème, utilisez Render.com qui est déjà configuré :

1. Le fichier `render.yaml` est déjà présent
2. Connectez votre repo GitHub à Render.com
3. Render détectera automatiquement la configuration

