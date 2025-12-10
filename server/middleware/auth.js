const jwt = require("jsonwebtoken");

// Middleware d'authentification JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // Pour la démo, on crée un utilisateur par défaut si pas de token
    req.user = { id: "demo-user", email: "demo@pifi.app" };
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
    if (err) {
      // Pour la démo, on continue avec un utilisateur par défaut
      req.user = { id: "demo-user", email: "demo@pifi.app" };
      return next();
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };

