# 🔍 Vérification Réseau - Pifi

## Problème : NetworkError

Si vous rencontrez une erreur "NetworkError when attempting to fetch resource", suivez ces étapes :

### 1. Vérifier que le backend est démarré

```bash
# Dans le dossier server
cd server
npm start
```

Vous devriez voir :
```
🚀 Serveur démarré sur le port 3001
📊 API disponible sur http://localhost:3001
```

### 2. Tester le backend directement

Ouvrez dans votre navigateur :
```
http://localhost:3001/health
```

Vous devriez voir :
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### 3. Vérifier les variables d'environnement

Créez un fichier `.env.local` dans le dossier `pifi` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
SERVER_PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 4. Vérifier les ports

- Frontend : http://localhost:3000
- Backend : http://localhost:3001

Assurez-vous qu'aucun autre processus n'utilise ces ports.

### 5. Vérifier CORS

Le backend est configuré pour accepter les requêtes depuis `http://localhost:3000`.

Si vous utilisez un autre port pour le frontend, modifiez `.env` dans le dossier `server` :

```env
FRONTEND_URL=http://localhost:VOTRE_PORT
```

### 6. Redémarrer les serveurs

1. Arrêtez les serveurs (Ctrl+C)
2. Redémarrez le backend :
   ```bash
   cd server
   npm start
   ```
3. Redémarrez le frontend :
   ```bash
   npm run dev
   ```

### 7. Vérifier la console du navigateur

Ouvrez les outils de développement (F12) et vérifiez :
- L'onglet Console pour les erreurs
- L'onglet Network pour voir les requêtes qui échouent

### Solutions communes

#### Backend non démarré
→ Démarrez le backend dans un terminal séparé

#### Port déjà utilisé
→ Changez le port dans `.env` ou arrêtez le processus qui utilise le port

#### CORS bloqué
→ Vérifiez que `FRONTEND_URL` dans le backend correspond à l'URL du frontend

#### Firewall/Antivirus
→ Vérifiez que votre firewall n'bloque pas les connexions locales

