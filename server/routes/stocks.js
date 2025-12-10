const express = require("express");
const router = express.Router();
const axios = require("axios");

// Obtenir les prix des actions (Yahoo Finance via API alternative)
router.get("/prices", async (req, res) => {
  try {
    // Liste d'actions populaires à suivre
    const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NVDA", "NFLX"];
    
    // Utiliser une API gratuite pour les actions
    // Note: En production, utilisez Alpha Vantage ou une autre API
    const stocks = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          // API alternative gratuite (exemple avec yahoo-finance-api ou similaire)
          // Pour la démo, on génère des données mockées
          return {
            symbol,
            name: getStockName(symbol),
            price: Math.random() * 500 + 50,
            change: (Math.random() - 0.5) * 10,
            changePercent: (Math.random() - 0.5) * 5,
            volume: Math.floor(Math.random() * 100000000),
            sparkline_data: Array.from({ length: 24 }, () => Math.random() * 500 + 50),
          };
        } catch (error) {
          return null;
        }
      })
    );

    res.json(stocks.filter(Boolean));
  } catch (error) {
    console.error("Erreur stocks:", error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des actions" });
  }
});

// Obtenir le prix d'une action spécifique
router.get("/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Mock data pour la démo
    res.json({
      symbol: symbol.toUpperCase(),
      name: getStockName(symbol),
      price: Math.random() * 500 + 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 100000000),
      high: Math.random() * 500 + 100,
      low: Math.random() * 500 + 50,
    });
  } catch (error) {
    console.error("Erreur stock:", error.message);
    res.status(500).json({ error: "Action non trouvée" });
  }
});

function getStockName(symbol) {
  const names = {
    AAPL: "Apple Inc.",
    GOOGL: "Alphabet Inc.",
    MSFT: "Microsoft Corporation",
    AMZN: "Amazon.com Inc.",
    TSLA: "Tesla Inc.",
    META: "Meta Platforms Inc.",
    NVDA: "NVIDIA Corporation",
    NFLX: "Netflix Inc.",
  };
  return names[symbol] || `${symbol} Corporation`;
}

module.exports = router;

