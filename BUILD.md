# 🚀 Guide de Build - Pifi

## Build de Production

### Prérequis
- Node.js >= 18.0.0
- npm >= 9.0.0

### Commandes disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Vérification TypeScript
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Nettoyage
npm run clean
```

## Configuration du Build

### Variables d'environnement

Créez un fichier `.env.local` avec :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
SERVER_PORT=3001
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-key-optional
COINGECKO_API_KEY=your-coingecko-key-optional
```

### Optimisations

- ✅ TypeScript strict mode activé
- ✅ ESLint configuré
- ✅ Images optimisées avec Next.js Image
- ✅ Compression activée
- ✅ Source maps désactivées en production
- ✅ Fonts optimisées

## Déploiement

### Render.com

Le fichier `render.yaml` est configuré pour déployer automatiquement :
- Frontend sur le port 3000
- Backend sur le port 3001

### Vercel

Le fichier `vercel.json` est configuré pour Vercel.

### Build local

```bash
npm run build
npm start
```

## Résolution de problèmes

### Erreurs de build TypeScript

```bash
npm run type-check
```

### Erreurs ESLint

```bash
npm run lint:fix
```

### Nettoyage complet

```bash
npm run clean
npm install
npm run build
```

