"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceWidgetProps {
  symbol: string;
  name: string;
  type: "crypto" | "stock";
  compact?: boolean;
}

export default function PriceWidget({ symbol, name, type, compact = false }: PriceWidgetProps) {
  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Rafraîchir toutes les 30s
    return () => clearInterval(interval);
  }, [symbol, type]);

  const fetchPrice = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const endpoint = type === "crypto" ? `/api/crypto/${symbol.toLowerCase()}` : `/api/stocks/${symbol}`;
      const response = await fetch(`${apiUrl}${endpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        setPrice(type === "crypto" ? data.current_price : data.price);
        setChange(type === "crypto" ? data.price_change_percentage_24h : data.changePercent);
      }
    } catch (error) {
      console.error("Erreur chargement prix:", error);
    } finally {
      setLoading(false);
    }
  };

  const isPositive = change >= 0;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">{symbol}</p>
            <p className="text-lg font-bold text-white">
              ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
            </p>
          </div>
          <div className={`flex items-center gap-1 ${isPositive ? "text-electric-blue" : "text-red-500"}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-semibold">
              {isPositive ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="text-sm text-gray-400 uppercase">{symbol}</p>
        </div>
        {isPositive ? (
          <TrendingUp className="w-6 h-6 text-electric-blue" />
        ) : (
          <TrendingDown className="w-6 h-6 text-red-500" />
        )}
      </div>

      <div>
        <p className="text-3xl font-bold text-white mb-2">
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
        </p>
        <p className={`text-lg font-semibold ${isPositive ? "text-electric-blue" : "text-red-500"}`}>
          {isPositive ? "+" : ""}
          {change.toFixed(2)}%
        </p>
      </div>
    </motion.div>
  );
}

