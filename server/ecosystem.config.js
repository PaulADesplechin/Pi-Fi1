// Configuration PM2 pour Render (optionnel)
module.exports = {
  apps: [{
    name: 'pifi-backend',
    script: 'index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};

