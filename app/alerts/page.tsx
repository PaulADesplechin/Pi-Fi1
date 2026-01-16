"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Bell, X, TrendingUp, TrendingDown, Settings } from "lucide-react";

interface Alert {
  id: string;
  assetType: "crypto" | "stock";
  symbol: string;
  name: string;
  threshold: number; // 3 ou 5
  direction: "up" | "down" | "both";
  active: boolean;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAlert, setNewAlert] = useState({
    assetType: "crypto" as "crypto" | "stock",
    symbol: "",
    threshold: 3,
    direction: "both" as "up" | "down" | "both",
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/alerts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des alertes:", error);
    }
  };

  const createAlert = async () => {
    if (typeof window === "undefined") return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(newAlert),
      });

      if (response.ok) {
        await fetchAlerts();
        setShowAddModal(false);
        setNewAlert({
          assetType: "crypto",
          symbol: "",
          threshold: 3,
          direction: "both",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'alerte:", error);
    }
  };

  const deleteAlert = async (id: string) => {
    if (typeof window === "undefined") return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/alerts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (response.ok) {
        await fetchAlerts();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'alerte:", error);
    }
  };

  const toggleAlert = async (id: string, active: boolean) => {
    if (typeof window === "undefined") return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/alerts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ active: !active }),
      });

      if (response.ok) {
        await fetchAlerts();
      }
    } catch (error) {
      console.error("Erreur lors de la modification de l'alerte:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Alertes</h1>
          <p className="text-gray-400">Configurez vos notifications automatiques</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Alerte
        </motion.button>
      </motion.div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass rounded-xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  alert.assetType === "crypto" 
                    ? "bg-electric-blue/20" 
                    : "bg-accent-purple/20"
                }`}>
                  <Bell className={`w-5 h-5 ${
                    alert.assetType === "crypto" 
                      ? "text-electric-blue" 
                      : "text-accent-purple"
                  }`} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{alert.name}</h3>
                  <p className="text-sm text-gray-400">{alert.symbol}</p>
                </div>
              </div>
              <button
                onClick={() => toggleAlert(alert.id, alert.active)}
                className={`w-12 h-6 rounded-full transition-all ${
                  alert.active ? "bg-electric-blue" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    alert.active ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Seuil:</span>
                <span className="text-white font-semibold">±{alert.threshold}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Direction:</span>
                <span className="text-white font-semibold capitalize">
                  {alert.direction === "both" ? "Hausse & Baisse" : alert.direction === "up" ? "Hausse" : "Baisse"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => deleteAlert(alert.id)}
                className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {alerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">Aucune alerte configurée</p>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            Créer votre première alerte
          </button>
        </motion.div>
      )}

      {/* Add Alert Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6 gradient-text">Nouvelle Alerte</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type d'actif
                </label>
                <select
                  value={newAlert.assetType}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, assetType: e.target.value as "crypto" | "stock" })
                  }
                  className="input-field"
                >
                  <option value="crypto">Cryptomonnaie</option>
                  <option value="stock">Action</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Symbole (ex: BTC, ETH, AAPL)
                </label>
                <input
                  type="text"
                  value={newAlert.symbol}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, symbol: e.target.value.toUpperCase() })
                  }
                  placeholder="BTC"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Seuil (%)
                </label>
                <select
                  value={newAlert.threshold}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, threshold: Number(e.target.value) })
                  }
                  className="input-field"
                >
                  <option value={3}>3%</option>
                  <option value={5}>5%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Direction
                </label>
                <select
                  value={newAlert.direction}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      direction: e.target.value as "up" | "down" | "both",
                    })
                  }
                  className="input-field"
                >
                  <option value="both">Hausse & Baisse</option>
                  <option value="up">Hausse uniquement</option>
                  <option value="down">Baisse uniquement</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 btn-secondary"
              >
                Annuler
              </button>
              <button onClick={createAlert} className="flex-1 btn-primary">
                Créer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

