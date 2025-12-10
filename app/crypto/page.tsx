"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  sparkline_data: number[];
}

const tradingPlatforms = {
  bitcoin: "https://www.binance.com/fr/trade/BTC_USDT",
  ethereum: "https://www.binance.com/fr/trade/ETH_USDT",
  default: "https://www.binance.com/fr",
};

export default function CryptoPage() {
  const [cryptos, setCryptos] = useState<CryptoAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset | null>(null);

  useEffect(() => {
    fetchCryptos();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchCryptos, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/crypto/prices`);
      
      if (response.ok) {
        const data = await response.json();
        setCryptos(data);
      } else {
        // Fallback vers CoinGecko direct si le backend n'est pas disponible
        const fallbackResponse = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true"
        );
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setCryptos(fallbackData);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des cryptos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTradingLink = (crypto: CryptoAsset) => {
    const symbol = crypto.symbol.toLowerCase();
    if (symbol === "btc" || symbol === "bitcoin") {
      return tradingPlatforms.bitcoin;
    } else if (symbol === "eth" || symbol === "ethereum") {
      return tradingPlatforms.ethereum;
    }
    return tradingPlatforms.default;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Cryptomonnaies</h1>
        <p className="text-gray-400">Suivez les prix en temps réel</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une cryptomonnaie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12"
          />
        </div>
      </motion.div>

      {/* Crypto List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCryptos.map((crypto, index) => {
            const isPositive = crypto.price_change_percentage_24h >= 0;
            const chartData = crypto.sparkline_data?.map((price, i) => ({
              time: i,
              price,
            })) || [];

            return (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="glass rounded-xl p-6 card-hover cursor-pointer"
                onClick={() => setSelectedCrypto(crypto)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{crypto.name}</h3>
                    <p className="text-sm text-gray-400 uppercase">{crypto.symbol}</p>
                  </div>
                  {isPositive ? (
                    <TrendingUp className="w-6 h-6 text-electric-blue" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-500" />
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-white">
                    ${crypto.current_price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      isPositive ? "text-electric-blue" : "text-red-500"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>

                {chartData.length > 0 && (
                  <div className="h-20 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={isPositive ? "#00d4ff" : "#ef4444"}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <Link
                  href={getTradingLink(crypto)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                >
                  Acheter sur Binance
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal pour détails */}
      {selectedCrypto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCrypto(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              {selectedCrypto.name}
            </h2>
            {/* Détails complets ici */}
            <button
              onClick={() => setSelectedCrypto(null)}
              className="btn-secondary mt-4"
            >
              Fermer
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

