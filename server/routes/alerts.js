const express = require("express");
const router = express.Router();
const alertService = require("../services/alertService");

// Middleware pour obtenir l'utilisateur (avec fallback démo)
function getUser(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (token) {
    try {
      const jwt = require("jsonwebtoken");
      const user = jwt.verify(token, process.env.JWT_SECRET || "secret");
      return user;
    } catch (error) {
      return { id: "demo-user", email: "demo@pifi.app" };
    }
  }
  
  return { id: "demo-user", email: "demo@pifi.app" };
}

// Obtenir toutes les alertes de l'utilisateur (public avec fallback)
router.get("/", (req, res) => {
  const user = getUser(req);
  const allAlerts = alertService.getAllAlerts();
  const userAlerts = allAlerts.filter((alert) => alert.userId === user.id);
  res.json(userAlerts);
});

// Créer une nouvelle alerte (public avec fallback)
router.post("/", async (req, res) => {
  try {
    const user = getUser(req);
    const userId = user.id;
    const { assetType, symbol, threshold, direction } = req.body;

    // Valider les données
    if (!assetType || !symbol || !threshold || !direction) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    if (!["crypto", "stock"].includes(assetType)) {
      return res.status(400).json({ error: "Type d'actif invalide" });
    }

    if (![3, 5].includes(threshold)) {
      return res.status(400).json({ error: "Seuil invalide (3% ou 5%)" });
    }

    const alert = {
      id: Date.now().toString(),
      userId,
      assetType,
      symbol: symbol.toUpperCase(),
      name: symbol.toUpperCase(), // À récupérer depuis l'API
      threshold,
      direction,
      active: true,
      createdAt: new Date().toISOString(),
    };

    alertService.addAlert(alert);
    res.status(201).json(alert);
  } catch (error) {
    console.error("Erreur création alerte:", error);
    res.status(500).json({ error: "Erreur lors de la création de l'alerte" });
  }
});

// Modifier une alerte (public avec fallback)
router.patch("/:id", (req, res) => {
  const user = getUser(req);
  const userId = user.id;
  const { id } = req.params;
  const updates = req.body;

  const allAlerts = alertService.getAllAlerts();
  const alertIndex = allAlerts.findIndex(
    (a) => a.id === id && a.userId === userId
  );

  if (alertIndex === -1) {
    return res.status(404).json({ error: "Alerte non trouvée" });
  }

  const updatedAlert = { ...allAlerts[alertIndex], ...updates };
  alertService.removeAlert(id);
  alertService.addAlert(updatedAlert);
  
  res.json(updatedAlert);
});

// Supprimer une alerte (public avec fallback)
router.delete("/:id", (req, res) => {
  const user = getUser(req);
  const userId = user.id;
  const { id } = req.params;

  const allAlerts = alertService.getAllAlerts();
  const alert = allAlerts.find((a) => a.id === id && a.userId === userId);

  if (!alert) {
    return res.status(404).json({ error: "Alerte non trouvée" });
  }

  alertService.removeAlert(id);
  res.json({ message: "Alerte supprimée" });
});

module.exports = router;

