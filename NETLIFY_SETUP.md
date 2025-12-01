# 🔧 Configuration Netlify - Guide Complet

## Problème actuel
Netlify affiche une erreur 404 malgré la présence de `index.html`.

## Solution

### Vérifications dans Netlify Dashboard

1. **Allez dans Site settings → Build & deploy**

2. **Build command** doit être :
   ```
   python -m pip install --upgrade pip && pip install -r requirements.txt && python extract_html.py
   ```

3. **Publish directory** doit être :
   ```
   .
   ```
   (un point, pas un dossier)

4. **Base directory** : laissez vide

### Vérifications des fichiers

1. **`index.html`** doit exister à la racine du projet
2. **`_redirects`** doit être à la racine (pas dans un sous-dossier)
3. **`netlify.toml`** doit être à la racine

### Test manuel

1. Après le déploiement, vérifiez les **Deploy logs**
2. Cherchez si `index.html` est créé pendant le build
3. Testez directement : `https://pietfi1.netlify.app/index.html`

### Si ça ne fonctionne toujours pas

**Option 1 : Utiliser Render.com (RECOMMANDÉ)**
- Render.com est mieux adapté pour Flask
- Le fichier `render.yaml` est déjà configuré
- Connectez simplement votre repo GitHub à Render.com

**Option 2 : Vérifier les logs Netlify**
- Allez dans **Deploys** → **Deploy log**
- Cherchez les erreurs Python ou de build
- Vérifiez que `extract_html.py` s'exécute correctement

**Option 3 : Build local**
```bash
python extract_html.py
# Vérifiez que index.html est créé
git add index.html
git commit -m "Add index.html"
git push
```

## Structure attendue après build

```
projettelegram/
├── index.html          ← DOIT EXISTER
├── _redirects          ← DOIT EXISTER
├── netlify.toml        ← DOIT EXISTER
├── static/             ← Fichiers statiques
└── netlify/
    └── functions/
        └── server/
            ├── server.py
            └── requirements.txt
```

