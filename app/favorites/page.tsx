"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Star, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface Favorite {
  id: string;
  type: "crypto" | "stock";
  symbol: string;
  name: string;
  price: number;
  change: number;
  sparkline_data: number[];
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    
    // Charger depuis localStorage
    const saved = localStorage.getItem("favorites");
    if (saved) {
      const favs = JSON.parse(saved);
      setFavorites(favs);
      // Charger les prix à jour
      updatePrices(favs);
    } else {
      setLoading(false);
    }
  };

  const updatePrices = async (favs: Favorite[]) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      
      // Mettre à jour les prix pour chaque favori
      const updated = await Promise.all(
        favs.map(async (fav) => {
          try {
            if (fav.type === "crypto") {
              const response = await fetch(`${apiUrl}/api/crypto/${fav.symbol.toLowerCase()}`);
              if (response.ok) {
                const data = await response.json();
                return {
                  ...fav,
                  price: data.current_price,
                  change: data.price_change_percentage_24h,
                };
              }
            } else {
              const response = await fetch(`${apiUrl}/api/stocks/${fav.symbol}`);
              if (response.ok) {
                const data = await response.json();
                return {
                  ...fav,
                  price: data.price,
                  change: data.changePercent,
                };
              }
            }
          } catch (error) {
            return fav;
          }
          return fav;
        })
      );
      
      setFavorites(updated);
    } catch (error) {
      console.error("Erreur mise à jour prix:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id: string) => {
    if (typeof window === "undefined") return;
    
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
              <Star className="w-10 h-10 text-electric-blue" />
              Mes Favoris
            </h1>
            <p className="text-gray-400">Suivez vos actifs préférés</p>
          </div>
          <Link href="/crypto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Ajouter des favoris
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">Aucun favori pour le moment</p>
          <p className="text-gray-500 mb-6">
            Ajoutez des cryptomonnaies ou actions à vos favoris depuis leurs pages respectives
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/crypto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Explorer les cryptos
              </motion.button>
            </Link>
            <Link href="/stocks">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                Explorer les actions
              </motion.button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite, index) => {
            const isPositive = favorite.change >= 0;
            const chartData = favorite.sparkline_data?.map((price, i) => ({
              time: i,
              price,
            })) || [];

            return (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="glass rounded-xl p-6 card-hover relative"
              >
                {/* Bouton favori */}
                <button
                  onClick={() => removeFavorite(favorite.id)}
                  className="absolute top-4 right-4 text-electric-blue hover:text-red-500 transition-colors"
                >
                  <Heart className="w-6 h-6 fill-current" />
                </button>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{favorite.name}</h3>
                      <p className="text-sm text-gray-400 uppercase">{favorite.symbol}</p>
                    </div>
                    <div className={`badge ${favorite.type === "crypto" ? "bg-electric-blue/20" : "bg-accent-purple/20"}`}>
                      {favorite.type === "crypto" ? "Crypto" : "Action"}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-white mb-1">
                    ${favorite.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-electric-blue" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <p
                      className={`text-sm font-semibold ${
                        isPositive ? "text-electric-blue" : "text-red-500"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {favorite.change.toFixed(2)}%
                    </p>
                  </div>
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

                <div className="flex gap-2">
                  <Link
                    href={favorite.type === "crypto" ? "/crypto" : "/stocks"}
                    className="flex-1 btn-secondary text-sm py-2 text-center"
                  >
                    Voir détails
                  </Link>
                  <a
                    href="https://www.binance.com/fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1"
                  >
                    Acheter
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

