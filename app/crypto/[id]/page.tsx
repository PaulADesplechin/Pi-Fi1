"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink, Heart, BarChart3, Clock } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface CryptoDetails {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_history: Array<{ time: string; price: number }>;
  volume_history: Array<{ time: string; volume: number }>;
}

export default function CryptoDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cryptoId = params.id as string;
  const [crypto, setCrypto] = useState<CryptoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites");
      if (saved) {
        const favs = JSON.parse(saved);
        setFavorites(favs.map((f: any) => f.symbol));
      }
    }
    fetchCryptoDetails();
  }, [cryptoId]);

  const fetchCryptoDetails = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      
      // Récupérer les données de base
      const response = await fetch(`${apiUrl}/api/crypto/${cryptoId.toLowerCase()}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Générer des données historiques simulées (à remplacer par vraies données API)
        const now = Date.now();
        const priceHistory = Array.from({ length: 24 }, (_, i) => ({
          time: new Date(now - (23 - i) * 3600000).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          price: data.current_price * (1 + (Math.random() - 0.5) * 0.1),
        }));
        
        const volumeHistory = Array.from({ length: 24 }, (_, i) => ({
          time: new Date(now - (23 - i) * 3600000).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          volume: data.total_volume * (0.5 + Math.random() * 0.5),
        }));

        setCrypto({
          ...data,
          price_history: priceHistory,
          volume_history: volumeHistory,
        });
      } else {
        // Fallback vers CoinGecko direct
        const fallbackResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const marketData = fallbackData.market_data;
          
          const now = Date.now();
          const priceHistory = Array.from({ length: 24 }, (_, i) => ({
            time: new Date(now - (23 - i) * 3600000).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            price: marketData.current_price.usd * (1 + (Math.random() - 0.5) * 0.1),
          }));
          
          const volumeHistory = Array.from({ length: 24 }, (_, i) => ({
            time: new Date(now - (23 - i) * 3600000).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            volume: marketData.total_volume.usd * (0.5 + Math.random() * 0.5),
          }));

          setCrypto({
            id: fallbackData.id,
            symbol: fallbackData.symbol.toUpperCase(),
            name: fallbackData.name,
            current_price: marketData.current_price.usd,
            price_change_percentage_24h: marketData.price_change_percentage_24h || 0,
            price_change_percentage_7d: marketData.price_change_percentage_7d_in_currency?.usd || 0,
            price_change_percentage_30d: marketData.price_change_percentage_30d_in_currency?.usd || 0,
            market_cap: marketData.market_cap.usd,
            total_volume: marketData.total_volume.usd,
            high_24h: marketData.high_24h.usd,
            low_24h: marketData.low_24h.usd,
            price_history: priceHistory,
            volume_history: volumeHistory,
          });
        }
      }
    } catch (error) {
      console.error("Erreur chargement détails:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (!crypto || typeof window === "undefined") return;
    
    const saved = localStorage.getItem("favorites") || "[]";
    const favs = JSON.parse(saved);
    const isFavorite = favorites.includes(crypto.symbol);
    
    if (isFavorite) {
      const updated = favs.filter((f: any) => f.symbol !== crypto.symbol);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setFavorites(updated.map((f: any) => f.symbol));
    } else {
      favs.push({
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        type: "crypto",
        price: crypto.current_price,
        change: crypto.price_change_percentage_24h,
      });
      localStorage.setItem("favorites", JSON.stringify(favs));
      setFavorites([...favorites, crypto.symbol]);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!crypto) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-400 text-lg mb-4">Cryptomonnaie non trouvée</p>
          <button onClick={() => router.back()} className="btn-primary">
            Retour
          </button>
        </motion.div>
      </div>
    );
  }

  const isPositive24h = crypto.price_change_percentage_24h >= 0;
  const isPositive7d = crypto.price_change_percentage_7d >= 0;
  const isPositive30d = crypto.price_change_percentage_30d >= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold gradient-text">{crypto.name}</h1>
              <span className="text-xl text-gray-400 uppercase">{crypto.symbol}</span>
              <button
                onClick={toggleFavorite}
                className="text-gray-400 hover:text-electric-blue transition-colors"
              >
                <Heart className={`w-6 h-6 ${favorites.includes(crypto.symbol) ? "fill-electric-blue text-electric-blue" : ""}`} />
              </button>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              ${crypto.current_price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
            </p>
            <div className="flex items-center gap-4">
              <span className={`text-lg font-semibold ${isPositive24h ? "text-electric-blue" : "text-red-500"}`}>
                {isPositive24h ? "+" : ""}
                {crypto.price_change_percentage_24h.toFixed(2)}% (24h)
              </span>
              <span className={`text-sm ${isPositive7d ? "text-electric-blue" : "text-red-500"}`}>
                {isPositive7d ? "+" : ""}
                {crypto.price_change_percentage_7d.toFixed(2)}% (7j)
              </span>
              <span className={`text-sm ${isPositive30d ? "text-electric-blue" : "text-red-500"}`}>
                {isPositive30d ? "+" : ""}
                {crypto.price_change_percentage_30d.toFixed(2)}% (30j)
              </span>
            </div>
          </div>
          <a
            href={`https://www.binance.com/fr/trade/${crypto.symbol}_USDT`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2"
          >
            Acheter sur Binance
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-2">Capitalisation</p>
          <p className="text-xl font-bold text-white">
            ${(crypto.market_cap / 1e9).toFixed(2)}B
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-2">Volume 24h</p>
          <p className="text-xl font-bold text-white">
            ${(crypto.total_volume / 1e6).toFixed(2)}M
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-2">Plus haut 24h</p>
          <p className="text-xl font-bold text-electric-blue">
            ${crypto.high_24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-2">Plus bas 24h</p>
          <p className="text-xl font-bold text-red-500">
            ${crypto.low_24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
          </p>
        </motion.div>
      </div>

      {/* Timeframe Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-2 mb-6 bg-dark-card p-1 rounded-lg w-fit"
      >
        {(["24h", "7d", "30d"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeframe === tf
                ? "bg-electric-blue text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tf}
          </button>
        ))}
      </motion.div>

      {/* Price Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-xl p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-electric-blue" />
          <h2 className="text-2xl font-bold text-white">Graphique des Prix</h2>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={crypto.price_history}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#151b2e",
                border: "1px solid #1e2640",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#00d4ff"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Volume Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-electric-blue" />
          <h2 className="text-2xl font-bold text-white">Volume des Transactions</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={crypto.volume_history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#151b2e",
                border: "1px solid #1e2640",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="volume" fill="#00d4ff" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

