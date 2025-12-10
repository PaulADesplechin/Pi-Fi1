"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant IA financier. Je peux vous aider à comprendre les tendances du marché, expliquer les mouvements de prix, et vous donner des informations sur les cryptomonnaies et les actions. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiUrl}/api/assistant/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-5).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Fallback si l'API n'est pas disponible
        const fallbackResponse = generateFallbackResponse(input);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallbackResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Désolé, je rencontre un problème technique. Veuillez réessayer plus tard.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (userInput: string): string => {
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
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-5rem)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Assistant IA</h1>
        <p className="text-gray-400">Votre coach financier quotidien</p>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 glass rounded-xl p-6 overflow-y-auto mb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-4 mb-6 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-electric-blue/20 text-electric-blue"
                    : "bg-accent-purple/20 text-accent-purple"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
              <div
                className={`flex-1 ${
                  message.role === "user" ? "text-right" : ""
                }`}
              >
                <div
                  className={`inline-block p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-electric-blue/20 text-white"
                      : "bg-dark-card text-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-accent-purple/20 text-accent-purple flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-dark-card p-4 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-accent-purple" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Posez votre question..."
          className="input-field flex-1"
          disabled={isLoading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="btn-primary px-6"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}

