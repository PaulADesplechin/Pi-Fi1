const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { OpenAI } = require("openai");
const axios = require("axios");

// Configuration OpenAI (optionnel, avec fallback si pas de clé)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Récupérer les données crypto pour l'assistant
async function getCryptoData(symbol) {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
    return response.data;
  } catch (error) {
    return null;
  }
}

// Chat avec l'assistant IA
router.post("/chat", async (req, res) => {
  try {
    // Vérifier le token si présent, sinon continuer en mode démo
    const token = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : "";
    
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message requis" });
    }

    let response;

    // Détecter si l'utilisateur demande des conseils crypto
    const lowerMessage = message.toLowerCase();
    const cryptoMentions = [];
    const cryptoKeywords = ["bitcoin", "btc", "ethereum", "eth", "crypto", "cryptomonnaie", "investir", "acheter", "vendre", "recommandation", "meilleur", "choix"];
    
    cryptoKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        cryptoMentions.push(keyword);
      }
    });

    // Si demande de conseils crypto, récupérer les données
    let cryptoData = null;
    if (cryptoMentions.length > 0) {
      // Essayer de détecter quelle crypto
      if (lowerMessage.includes("bitcoin") || lowerMessage.includes("btc")) {
        cryptoData = await getCryptoData("bitcoin");
      } else if (lowerMessage.includes("ethereum") || lowerMessage.includes("eth")) {
        cryptoData = await getCryptoData("ethereum");
      } else if (lowerMessage.includes("investir") || lowerMessage.includes("acheter") || lowerMessage.includes("recommandation")) {
        // Récupérer les top cryptos pour recommandation
        try {
          const topCryptos = await axios.get(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false"
          );
          cryptoData = { topCryptos: topCryptos.data };
        } catch (error) {
          console.error("Erreur récupération top cryptos:", error);
        }
      }
    }

    if (openai && cryptoMentions.length > 0) {
      // Utiliser OpenAI avec contexte crypto
      let systemPrompt = "Tu es un assistant financier expert spécialisé dans les cryptomonnaies. Tu fournis des analyses et des informations éducatives, mais tu ne donnes jamais de conseils d'investissement spécifiques. Tu expliques les tendances, les mouvements de prix, et les concepts financiers de manière claire et accessible.\n\n";
      
      if (cryptoData) {
        systemPrompt += "Données actuelles du marché:\n";
        systemPrompt += JSON.stringify(cryptoData, null, 2);
        systemPrompt += "\n\n";
      }
      
      systemPrompt += "Règles importantes:\n";
      systemPrompt += "- Ne jamais dire \"achetez\" ou \"vendez\" directement\n";
      systemPrompt += "- Utiliser \"vous pourriez considérer\" ou \"certains investisseurs\"\n";
      systemPrompt += "- Toujours mentionner les risques\n";
      systemPrompt += "- Fournir des analyses basées sur les données\n";
      systemPrompt += "- Être transparent sur les limitations";

      const messages = [
        { role: "system", content: systemPrompt },
        ...(history || []).map((msg) => ({
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
      // Fallback: réponse intelligente avec données crypto
      response = generateIntelligentResponse(message, cryptoData, cryptoMentions);
    }

    res.json({ response });
  } catch (error) {
    console.error("Erreur assistant:", error);
    res.status(500).json({ error: "Erreur lors du traitement de la demande" });
  }
});

function generateIntelligentResponse(userInput, cryptoData, cryptoMentions) {
  const lowerInput = userInput.toLowerCase();

  // Réponses pour recommandations crypto
  if (lowerInput.includes("recommandation") || lowerInput.includes("meilleur") || lowerInput.includes("choix")) {
    if (cryptoData && cryptoData.topCryptos) {
      const top5 = cryptoData.topCryptos;
      let response = "Voici les 5 principales cryptomonnaies par capitalisation actuelle :\n\n";
      top5.forEach((crypto, index) => {
        const change = crypto.price_change_percentage_24h || 0;
        const trend = change >= 0 ? "📈" : "📉";
        response += `${index + 1}. **${crypto.name} (${crypto.symbol.toUpperCase()})**\n`;
        response += `   Prix: $${crypto.current_price.toLocaleString()}\n`;
        response += `   Variation 24h: ${change >= 0 ? "+" : ""}${change.toFixed(2)}% ${trend}\n`;
        response += `   Capitalisation: $${(crypto.market_cap / 1e9).toFixed(2)}B\n\n`;
      });
      response += "💡 **Conseil** : Faites toujours vos propres recherches (DYOR) avant d'investir. La diversification est importante pour gérer les risques.";
      return response;
    }
    return "Pour vous aider à faire un choix éclairé, je recommande de considérer plusieurs facteurs :\n\n1. **Capitalisation** : Les cryptos avec une grande capitalisation sont généralement plus stables\n2. **Volume de trading** : Un volume élevé indique une bonne liquidité\n3. **Tendances récentes** : Analysez les variations sur 24h, 7j et 30j\n4. **Votre profil de risque** : Adaptez vos choix à votre tolérance au risque\n\n💡 Consultez la page Crypto pour voir les données en temps réel et configurez des alertes pour suivre les mouvements.";
  }

  // Réponses pour Bitcoin
  if (lowerInput.includes("bitcoin") || lowerInput.includes("btc")) {
    if (cryptoData) {
      const data = cryptoData.market_data;
      const price = data.current_price.usd.toLocaleString();
      const change24h = data.price_change_percentage_24h >= 0 ? "+" : "";
      const change24hValue = data.price_change_percentage_24h.toFixed(2);
      const high24h = data.high_24h.usd.toLocaleString();
      const low24h = data.low_24h.usd.toLocaleString();
      return "**Bitcoin (BTC)** - Analyse actuelle :\n\n💰 Prix actuel : $" + price + "\n📊 Variation 24h : " + change24h + change24hValue + "%\n📈 Plus haut 24h : $" + high24h + "\n📉 Plus bas 24h : $" + low24h + "\n\n💡 Bitcoin reste la cryptomonnaie dominante avec la plus grande capitalisation. C'est souvent considéré comme une réserve de valeur numérique. Cependant, la volatilité reste élevée.";
    }
    return "Bitcoin (BTC) est la première cryptomonnaie créée en 2009. C'est une monnaie décentralisée qui utilise la technologie blockchain. Le prix de Bitcoin peut être très volatil et est influencé par de nombreux facteurs comme l'adoption institutionnelle, la régulation, et les événements macroéconomiques.";
  }

  // Réponses pour Ethereum
  if (lowerInput.includes("ethereum") || lowerInput.includes("eth")) {
    if (cryptoData) {
      const data = cryptoData.market_data;
      const price = data.current_price.usd.toLocaleString();
      const change24h = data.price_change_percentage_24h >= 0 ? "+" : "";
      const change24hValue = data.price_change_percentage_24h.toFixed(2);
      const high24h = data.high_24h.usd.toLocaleString();
      const low24h = data.low_24h.usd.toLocaleString();
      return "**Ethereum (ETH)** - Analyse actuelle :\n\n💰 Prix actuel : $" + price + "\n📊 Variation 24h : " + change24h + change24hValue + "%\n📈 Plus haut 24h : $" + high24h + "\n📉 Plus bas 24h : $" + low24h + "\n\n💡 Ethereum est une plateforme blockchain programmable qui permet de créer des applications décentralisées (dApps) et des smart contracts. C'est la deuxième plus grande cryptomonnaie par capitalisation.";
    }
    return "Ethereum (ETH) est une plateforme blockchain qui permet de créer des applications décentralisées (dApps) et des smart contracts. Contrairement à Bitcoin qui est principalement une monnaie, Ethereum est une plateforme programmable.";
  }

  // Réponses pour tendances
  if (lowerInput.includes("tendance") || lowerInput.includes("marché")) {
    return "Les tendances du marché crypto sont influencées par plusieurs facteurs :\n\n1. **Adoption institutionnelle** : L'entrée de grandes entreprises\n2. **Régulations** : Les décisions gouvernementales\n3. **Événements macroéconomiques** : Inflation, taux d'intérêt\n4. **Innovation technologique** : Nouvelles fonctionnalités blockchain\n\n💡 Utilisez les graphiques sur la page Crypto pour analyser les tendances visuellement. Configurez des alertes pour être notifié des mouvements importants.";
  }

  // Réponses pour investir/acheter
  if (lowerInput.includes("investir") || lowerInput.includes("acheter")) {
    return "Avant d'investir dans une cryptomonnaie, considérez :\n\n✅ **Points à vérifier** :\n- Capitalisation de marché\n- Volume de trading\n- Tendances de prix (24h, 7j, 30j)\n- Utilisation réelle et adoption\n- Équipe et développement\n\n⚠️ **Risques à considérer** :\n- Volatilité élevée\n- Risque de perte totale\n- Régulation incertaine\n\n💡 Je recommande de :\n1. Ne jamais investir plus que ce que vous pouvez perdre\n2. Diversifier votre portefeuille\n3. Faire vos propres recherches (DYOR)\n4. Utiliser les alertes pour suivre les mouvements\n\nConsultez la page Crypto pour voir les données en temps réel.";
  }

  // Réponse par défaut
  return "Je comprends votre question. Je peux vous aider à :\n\n- Analyser les tendances du marché crypto\n- Expliquer les mouvements de prix\n- Vous donner des informations sur les cryptomonnaies\n- Vous aider à faire des choix éclairés\n\n💡 Pour des conseils personnalisés, posez-moi des questions spécifiques comme :\n- \"Quelles sont les meilleures cryptos actuellement ?\"\n- \"Dois-je investir dans Bitcoin ?\"\n- \"Quelles sont les tendances du marché ?\"\n\n⚠️ Rappel : Je fournis des informations éducatives, pas des conseils d'investissement. Consultez toujours un conseiller financier professionnel pour des décisions importantes.";
}

module.exports = router;
