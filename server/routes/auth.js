const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authenticateToken } = require("../middleware/auth");

// Base de données en mémoire (remplacer par MongoDB en production)
let users = [];

// Inscription
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Vérifier si l'utilisateur existe déjà
    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(user);

    // Générer le token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Erreur inscription:", error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    // Générer le token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Erreur connexion:", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

// Obtenir les informations de l'utilisateur connecté (avec fallback démo)
router.get("/me", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const user = users.find((u) => u.id === userId);
  
  if (!user) {
    // Fallback pour mode démo
    return res.json({
      id: req.user.id,
      email: req.user.email || "demo@pifi.app",
      username: req.user.username || req.user.email?.split("@")[0] || "demo-user",
      createdAt: new Date().toISOString(),
    });
  }

  res.json({
    id: user.id,
    email: user.email,
    username: user.email?.split("@")[0] || "user",
    createdAt: user.createdAt,
  });
});

module.exports = router;
