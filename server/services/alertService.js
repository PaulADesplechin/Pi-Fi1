const axios = require("axios");

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const CHECK_INTERVAL = 30000; // 30 secondes

let alerts = []; // En production, récupérer depuis MongoDB
let previousPrices = {}; // Stocker les prix précédents

// Démarrer le service d'alertes
function start(io) {
  console.log("🔔 Service d'alertes démarré");

  setInterval(async () => {
    await checkAlerts(io);
  }, CHECK_INTERVAL);

  // Première vérification immédiate
  checkAlerts(io);
}

// Vérifier toutes les alertes actives
async function checkAlerts(io) {
  try {
    // Récupérer les alertes actives depuis la base de données
    // Pour la démo, on utilise une liste en mémoire
    const activeAlerts = alerts.filter((alert) => alert.active);

    if (activeAlerts.length === 0) {
      return;
    }

    // Grouper par type d'actif
    const cryptoAlerts = activeAlerts.filter((a) => a.assetType === "crypto");
    const stockAlerts = activeAlerts.filter((a) => a.assetType === "stock");

    // Vérifier les cryptos
    if (cryptoAlerts.length > 0) {
      await checkCryptoAlerts(cryptoAlerts, io);
    }

    // Vérifier les actions
    if (stockAlerts.length > 0) {
      await checkStockAlerts(stockAlerts, io);
    }
  } catch (error) {
    console.error("Erreur lors de la vérification des alertes:", error);
  }
}

// Vérifier les alertes crypto
async function checkCryptoAlerts(cryptoAlerts, io) {
  try {
    const symbols = [...new Set(cryptoAlerts.map((a) => a.symbol.toLowerCase()))];
    
    // Récupérer les prix depuis CoinGecko
    const response = await axios.get(
      `${COINGECKO_API}/coins/markets`,
      {
        params: {
          vs_currency: "usd",
          ids: symbols.join(","),
        },
      }
    );

    const prices = {};
    response.data.forEach((coin) => {
      prices[coin.symbol.toUpperCase()] = {
        current: coin.current_price,
        change24h: coin.price_change_percentage_24h,
      };
    });

    // Vérifier chaque alerte
    cryptoAlerts.forEach((alert) => {
      const priceData = prices[alert.symbol];
      if (!priceData) return;

      const change = priceData.change24h;
      const absChange = Math.abs(change);

      // Vérifier si le seuil est atteint
      if (absChange >= alert.threshold) {
        const shouldAlert =
          (alert.direction === "up" && change > 0) ||
          (alert.direction === "down" && change < 0) ||
          alert.direction === "both";

        if (shouldAlert) {
          // Vérifier si on n'a pas déjà envoyé cette alerte récemment
          const alertKey = `${alert.id}-${alert.threshold}`;
          const previousPrice = previousPrices[alertKey];

          if (!previousPrice || Math.abs(change - previousPrice) > 0.5) {
            sendAlert(alert, change, priceData.current, io);
            previousPrices[alertKey] = change;
          }
        }
      }
    });
  } catch (error) {
    console.error("Erreur vérification crypto:", error.message);
  }
}

// Vérifier les alertes actions
async function checkStockAlerts(stockAlerts, io) {
  // Pour la démo, on simule des variations
  stockAlerts.forEach((alert) => {
    const mockChange = (Math.random() - 0.5) * 10; // Variation entre -5% et +5%
    const absChange = Math.abs(mockChange);

    if (absChange >= alert.threshold) {
      const shouldAlert =
        (alert.direction === "up" && mockChange > 0) ||
        (alert.direction === "down" && mockChange < 0) ||
        alert.direction === "both";

      if (shouldAlert) {
        sendAlert(alert, mockChange, 100, io);
      }
    }
  });
}

// Envoyer une alerte
function sendAlert(alert, change, currentPrice, io) {
  const alertData = {
    id: Date.now().toString(),
    alertId: alert.id,
    userId: alert.userId,
    assetType: alert.assetType,
    symbol: alert.symbol,
    name: alert.name,
    change: change.toFixed(2),
    currentPrice,
    threshold: alert.threshold,
    type: change > 0 ? "up" : "down",
    timestamp: new Date().toISOString(),
  };

  // Envoyer via WebSocket à l'utilisateur spécifique
  io.to(`user-${alert.userId}`).emit("alert", alertData);

  console.log(`🔔 Alerte envoyée: ${alert.symbol} ${change > 0 ? "+" : ""}${change.toFixed(2)}%`);
}

// Fonction pour mettre à jour la liste des alertes (appelée depuis les routes)
function updateAlerts(newAlerts) {
  alerts = newAlerts;
}

// Fonction pour ajouter une alerte
function addAlert(alert) {
  alerts.push(alert);
}

// Fonction pour supprimer une alerte
function removeAlert(alertId) {
  alerts = alerts.filter((a) => a.id !== alertId);
}

// Fonction pour obtenir toutes les alertes
function getAllAlerts() {
  return alerts;
}

module.exports = {
  start,
  updateAlerts,
  addAlert,
  removeAlert,
  getAllAlerts,
};
