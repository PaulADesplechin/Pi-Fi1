const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { OpenAI } = require("openai");

// Configuration OpenAI (optionnel, avec fallback si pas de clé)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Chat avec l'assistant IA
router.post("/chat", authenticateToken, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message requis" });
    }

    let response;

    if (openai) {
      // Utiliser OpenAI si disponible
      const messages = [
        {
          role: "system",
          content:
            "Tu es un assistant financier expert. Tu fournis des informations éducatives sur les cryptomonnaies et les actions, mais tu ne donnes jamais de conseils d'investissement spécifiques. Tu expliques les tendances, les mouvements de prix, et les concepts financiers de manière claire et accessible.",
        },
        ...history.map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        { role: "user", content: message },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      response = completion.choices[0].message.content;
    } else {
      // Fallback: réponse basique
      response = generateFallbackResponse(message);
    }

    res.json({ response });
  } catch (error) {
    console.error("Erreur assistant:", error);
    res.status(500).json({ error: "Erreur lors du traitement de la demande" });
  }
});

function generateFallbackResponse(userInput) {
  const lowerInput = userInput.toLowerCase();

  if (lowerInput.includes("bitcoin") || lowerInput.includes("btc")) {
    return "Bitcoin (BTC) est la première cryptomonnaie créée en 2009. C'est une monnaie décentralisée qui utilise la technologie blockchain. Le prix de Bitcoin peut être très volatil et est influencé par de nombreux facteurs comme l'adoption institutionnelle, la régulation, et les événements macroéconomiques.";
  }

  if (lowerInput.includes("ethereum") || lowerInput.includes("eth")) {
    return "Ethereum (ETH) est une plateforme blockchain qui permet de créer des applications décentralisées (dApps) et des smart contracts. Contrairement à Bitcoin qui est principalement une monnaie, Ethereum est une plateforme programmable.";
  }

  if (lowerInput.includes("tendance") || lowerInput.includes("marché")) {
    return "Les tendances du marché crypto sont influencées par plusieurs facteurs : l'adoption institutionnelle, les régulations gouvernementales, les événements macroéconomiques (inflation, taux d'intérêt), et l'innovation technologique. Il est important de faire vos propres recherches et de ne pas investir plus que ce que vous pouvez vous permettre de perdre.";
  }

  if (lowerInput.includes("alerte") || lowerInput.includes("notification")) {
    return "Vous pouvez configurer des alertes dans la section 'Alertes' de l'application. Choisissez un actif (crypto ou action), définissez un seuil de variation (3% ou 5%), et sélectionnez si vous voulez être alerté en cas de hausse, de baisse, ou les deux.";
  }

  return "Je comprends votre question. Pour des conseils financiers personnalisés, je recommande de consulter un conseiller financier professionnel. Je peux vous fournir des informations générales sur les cryptomonnaies et les actions, mais je ne peux pas donner de conseils d'investissement spécifiques.";
}

module.exports = router;

