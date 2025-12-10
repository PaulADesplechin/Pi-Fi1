const express = require("express");
const router = express.Router();

// Obtenir les statistiques du dashboard (public)
router.get("/", async (req, res) => {
  try {
    // Récupérer les stats depuis la base de données
    // Pour la démo, on retourne des données mockées
    res.json({
      totalCrypto: 12,
      totalStocks: 8,
      activeAlerts: 5,
      totalValue: 125000,
    });
  } catch (error) {
    console.error("Erreur stats:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des stats" });
  }
});

module.exports = router;

