"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitCompare, Search, X, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ComparePage() {
  const [assets, setAssets] = useState<Array<{ symbol: string; name: string; type: "crypto" | "stock" }>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  const addAsset = (symbol: string, name: string, type: "crypto" | "stock") => {
    if (assets.length < 5 && !assets.find((a) => a.symbol === symbol)) {
      setAssets([...assets, { symbol, name, type }]);
      setSearchTerm("");
      loadComparisonData([...assets, { symbol, name, type }]);
    }
  };

  const removeAsset = (symbol: string) => {
    const updated = assets.filter((a) => a.symbol !== symbol);
    setAssets(updated);
    loadComparisonData(updated);
  };

  const loadComparisonData = async (assetsToCompare: typeof assets) => {
    if (assetsToCompare.length === 0) {
      setComparisonData([]);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const data = await Promise.all(
        assetsToCompare.map(async (asset) => {
          try {
            if (asset.type === "crypto") {
              const response = await fetch(`${apiUrl}/api/crypto/${asset.symbol.toLowerCase()}`);
              if (response.ok) {
                const crypto = await response.json();
                return {
                  symbol: asset.symbol,
                  name: asset.name,
                  price: crypto.current_price,
                  change: crypto.price_change_percentage_24h,
                  type: "crypto",
                };
              }
            } else {
              const response = await fetch(`${apiUrl}/api/stocks/${asset.symbol}`);
              if (response.ok) {
                const stock = await response.json();
                return {
                  symbol: asset.symbol,
                  name: asset.name,
                  price: stock.price,
                  change: stock.changePercent,
                  type: "stock",
                };
              }
            }
          } catch (error) {
            return null;
          }
          return null;
        })
      );

      setComparisonData(data.filter(Boolean));
    } catch (error) {
      console.error("Erreur chargement comparaison:", error);
    }
  };

  const chartData = comparisonData.map((asset) => ({
    name: asset.symbol,
    price: asset.price,
    change: asset.change,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
          <GitCompare className="w-10 h-10 text-electric-blue" />
          Comparer des Actifs
        </h1>
        <p className="text-gray-400">Comparez jusqu'à 5 actifs côte à côte</p>
      </motion.div>

      {/* Recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6 mb-6"
      >
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un actif (ex: BTC, ETH, AAPL)..."
              className="input-field pl-12"
            />
          </div>
          <button
            onClick={() => {
              if (searchTerm) {
                const parts = searchTerm.toUpperCase().split(" ");
                addAsset(parts[0], parts[0], "crypto");
              }
            }}
            className="btn-primary"
            disabled={assets.length >= 5}
          >
            Ajouter
          </button>
        </div>
      </motion.div>

      {/* Actifs sélectionnés */}
      {assets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Actifs sélectionnés</h2>
          <div className="flex flex-wrap gap-3">
            {assets.map((asset) => (
              <div
                key={asset.symbol}
                className="bg-dark-card px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <span className="text-white font-semibold">
                  {asset.symbol} ({asset.name})
                </span>
                <button
                  onClick={() => removeAsset(asset.symbol)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Comparaison */}
      {comparisonData.length > 0 && (
        <div className="space-y-6">
          {/* Tableau comparatif */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6 overflow-x-auto"
          >
            <h2 className="text-xl font-bold text-white mb-4">Comparaison</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-gray-400">Actif</th>
                  <th className="text-right py-3 px-4 text-gray-400">Prix</th>
                  <th className="text-right py-3 px-4 text-gray-400">Variation 24h</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((asset) => (
                  <tr key={asset.symbol} className="border-b border-dark-border/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-semibold">{asset.name}</p>
                        <p className="text-sm text-gray-400">{asset.symbol}</p>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">
                      <p className="text-white font-semibold">
                        ${asset.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}
                      </p>
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {asset.change >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-electric-blue" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <p
                          className={`font-semibold ${
                            asset.change >= 0 ? "text-electric-blue" : "text-red-500"
                          }`}
                        >
                          {asset.change >= 0 ? "+" : ""}
                          {asset.change.toFixed(2)}%
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Graphique comparatif */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Graphique comparatif</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151b2e",
                    border: "1px solid #1e2640",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  name="Prix ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {assets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <GitCompare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">
            Aucun actif sélectionné pour la comparaison
          </p>
          <p className="text-gray-500">
            Recherchez et ajoutez des actifs pour les comparer
          </p>
        </motion.div>
      )}
    </div>
  );
}

