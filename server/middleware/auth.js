const jwt = require("jsonwebtoken");

// Middleware d'authentification JWT (toujours autorise, avec fallback démo)
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // Pour la démo, on crée un utilisateur par défaut si pas de token
    req.user = { id: "demo-user", email: "demo@pifi.app", username: "demo-user" };
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
    if (err) {
      // Pour la démo, on continue avec un utilisateur par défaut même si token invalide
      req.user = { id: "demo-user", email: "demo@pifi.app", username: "demo-user" };
      return next();
    }
    req.user = user;
    next();
  });
}

// Middleware optionnel (ne bloque jamais)
function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = { id: "demo-user", email: "demo@pifi.app", username: "demo-user" };
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
    if (err) {
      req.user = { id: "demo-user", email: "demo@pifi.app", username: "demo-user" };
    } else {
      req.user = user;
    }
    next();
  });
}

module.exports = { authenticateToken, optionalAuth };
