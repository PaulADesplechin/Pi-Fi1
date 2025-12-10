"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  sparkline_data: number[];
}

const tradingPlatforms = {
  binance: "https://www.binance.com/fr",
  kraken: "https://www.kraken.com/en-us/prices",
  default: "https://www.binance.com/fr",
};

export default function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/stocks/prices`);
      
      if (response.ok) {
        const data = await response.json();
        setStocks(data);
      } else {
        // Données mockées pour démo
        setStocks([
          {
            symbol: "AAPL",
            name: "Apple Inc.",
            price: 175.43,
            change: 2.15,
            changePercent: 1.24,
            volume: 50000000,
            sparkline_data: [173, 174, 175, 174.5, 175.43],
          },
          {
            symbol: "GOOGL",
            name: "Alphabet Inc.",
            price: 142.56,
            change: -1.23,
            changePercent: -0.85,
            volume: 30000000,
            sparkline_data: [143, 142.5, 142, 142.8, 142.56],
          },
          {
            symbol: "MSFT",
            name: "Microsoft Corporation",
            price: 378.91,
            change: 4.32,
            changePercent: 1.15,
            volume: 25000000,
            sparkline_data: [374, 376, 378, 377, 378.91],
          },
        ]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des actions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Actions Boursières</h1>
        <p className="text-gray-400">Suivez les cours en temps réel</p>
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
            placeholder="Rechercher une action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12"
          />
        </div>
      </motion.div>

      {/* Stocks List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStocks.map((stock, index) => {
            const isPositive = stock.changePercent >= 0;
            const chartData = stock.sparkline_data?.map((price, i) => ({
              time: i,
              price,
            })) || [];

            return (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="glass rounded-xl p-6 card-hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{stock.name}</h3>
                    <p className="text-sm text-gray-400">{stock.symbol}</p>
                  </div>
                  {isPositive ? (
                    <TrendingUp className="w-6 h-6 text-electric-blue" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-500" />
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-white">
                    ${stock.price.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      isPositive ? "text-electric-blue" : "text-red-500"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%)
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

                <a
                  href={tradingPlatforms.binance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                >
                  Acheter sur Binance
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

