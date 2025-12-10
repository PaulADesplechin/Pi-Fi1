const express = require("express");
const router = express.Router();
const axios = require("axios");

const COINGECKO_API = "https://api.coingecko.com/api/v3";

// Obtenir les prix des cryptomonnaies
router.get("/prices", async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const response = await axios.get(
      `${COINGECKO_API}/coins/markets`,
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: limit,
          page: 1,
          sparkline: true,
        },
      }
    );

    const cryptos = response.data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      sparkline_data: coin.sparkline_in_7d?.price || [],
      image: coin.image,
    }));

    res.json(cryptos);
  } catch (error) {
    console.error("Erreur CoinGecko:", error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des prix" });
  }
});

// Obtenir le prix d'une crypto spécifique
router.get("/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const response = await axios.get(
      `${COINGECKO_API}/coins/${symbol}`,
      {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
        },
      }
    );

    const coin = response.data;
    res.json({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.market_data.current_price.usd,
      price_change_24h: coin.market_data.price_change_24h,
      price_change_percentage_24h: coin.market_data.price_change_percentage_24h,
      price_change_percentage_7d: coin.market_data.price_change_percentage_7d_in_currency?.usd || 0,
      price_change_percentage_30d: coin.market_data.price_change_percentage_30d_in_currency?.usd || 0,
      market_cap: coin.market_data.market_cap.usd,
      total_volume: coin.market_data.total_volume.usd,
      high_24h: coin.market_data.high_24h.usd,
      low_24h: coin.market_data.low_24h.usd,
    });
  } catch (error) {
    console.error("Erreur CoinGecko:", error.message);
    res.status(500).json({ error: "Cryptomonnaie non trouvée" });
  }
});

module.exports = router;

