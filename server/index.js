const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || process.env.SERVER_PORT || 3001;

// Middleware CORS amélioré
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware pour parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour logger les requêtes (dev seulement)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use("/api/crypto", require("./routes/crypto"));
app.use("/api/stocks", require("./routes/stocks"));
app.use("/api/alerts", require("./routes/alerts"));
app.use("/api/assistant", require("./routes/assistant"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/auth", require("./routes/auth"));

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connecté:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client déconnecté:", socket.id);
  });

  socket.on("subscribe-alerts", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`Utilisateur ${userId} abonné aux alertes`);
  });
});

// Système d'alertes automatiques
const alertService = require("./services/alertService");
alertService.start(io);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 API disponible sur http://localhost:${PORT}`);
});

module.exports = { app, io };

