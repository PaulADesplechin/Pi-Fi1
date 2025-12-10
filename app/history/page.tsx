"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, TrendingDown, Filter, Download } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

interface AlertHistory {
  id: string;
  symbol: string;
  name: string;
  type: "up" | "down";
  change: number;
  threshold: number;
  timestamp: string;
  assetType: "crypto" | "stock";
}

export default function HistoryPage() {
  const [history, setHistory] = useState<AlertHistory[]>([]);
  const [filter, setFilter] = useState<"all" | "crypto" | "stock">("all");
  const [sortBy, setSortBy] = useState<"date" | "change">("date");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const saved = localStorage.getItem("alertHistory");
    if (saved) {
      const hist = JSON.parse(saved);
      setHistory(hist);
    }
  };

  const filteredHistory = history
    .filter((item) => filter === "all" || item.assetType === filter)
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else {
        return Math.abs(b.change) - Math.abs(a.change);
      }
    });

  const exportToCSV = () => {
    const headers = ["Date", "Symbole", "Nom", "Type", "Variation (%)", "Seuil (%)"];
    const rows = filteredHistory.map((item) => [
      format(new Date(item.timestamp), "dd/MM/yyyy HH:mm", { locale: fr }),
      item.symbol,
      item.name,
      item.assetType,
      item.change.toFixed(2),
      item.threshold,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pifi-alertes-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
              <Clock className="w-10 h-10 text-electric-blue" />
              Historique des Alertes
            </h1>
            <p className="text-gray-400">Consultez toutes vos alertes passées</p>
          </div>
          {filteredHistory.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Exporter CSV
            </motion.button>
          )}
        </div>

        {/* Filtres */}
        <div className="glass rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300">Filtrer :</span>
          </div>
          {(["all", "crypto", "stock"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === f
                  ? "bg-electric-blue text-white"
                  : "bg-dark-card text-gray-400 hover:text-white"
              }`}
            >
              {f === "all" ? "Tous" : f === "crypto" ? "Cryptos" : "Actions"}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-gray-300">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "change")}
              className="input-field w-auto"
            >
              <option value="date">Date</option>
              <option value="change">Variation</option>
            </select>
          </div>
        </div>
      </motion.div>

      {filteredHistory.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">Aucun historique</p>
          <p className="text-gray-500">
            Les alertes déclenchées apparaîtront ici
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl p-6 card-hover"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      item.type === "up"
                        ? "bg-electric-blue/20 text-electric-blue"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {item.type === "up" ? (
                      <TrendingUp className="w-6 h-6" />
                    ) : (
                      <TrendingDown className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {item.name} ({item.symbol})
                    </h3>
                    <p className="text-sm text-gray-400">
                      {format(new Date(item.timestamp), "dd MMMM yyyy à HH:mm", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-2xl font-bold ${
                      item.type === "up" ? "text-electric-blue" : "text-red-500"
                    }`}
                  >
                    {item.type === "up" ? "+" : ""}
                    {item.change.toFixed(2)}%
                  </p>
                  <p className="text-sm text-gray-400">
                    Seuil : {item.threshold}%
                  </p>
                  <span className="badge mt-2">
                    {item.assetType === "crypto" ? "Crypto" : "Action"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

