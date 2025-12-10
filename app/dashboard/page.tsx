"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCrypto: 0,
    totalStocks: 0,
    activeAlerts: 0,
    totalValue: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Simuler des données (remplacer par appel API réel)
    const mockData = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: Math.random() * 10000 + 50000,
    }));
    setChartData(mockData);

    // Charger les statistiques
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des stats:", error);
    }
  };

  const statCards = [
    {
      title: "Cryptomonnaies",
      value: stats.totalCrypto,
      icon: DollarSign,
      color: "text-electric-blue",
      bgColor: "bg-electric-blue/10",
    },
    {
      title: "Actions",
      value: stats.totalStocks,
      icon: Activity,
      color: "text-accent-purple",
      bgColor: "bg-accent-purple/10",
    },
    {
      title: "Alertes Actives",
      value: stats.activeAlerts,
      icon: TrendingUp,
      color: "text-accent-cyan",
      bgColor: "bg-accent-cyan/10",
    },
    {
      title: "Valeur Totale",
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-electric-blue",
      bgColor: "bg-electric-blue/10",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-gray-400">Vue d'ensemble de vos investissements</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-6 mb-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Évolution 24h</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
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
              dataKey="value"
              stroke="#00d4ff"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Alertes Récentes</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-dark-card rounded-lg border border-dark-border"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-electric-blue" />
                </div>
                <div>
                  <p className="font-semibold text-white">BTC/USDT</p>
                  <p className="text-sm text-gray-400">Il y a 5 minutes</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-electric-blue">+4.2%</p>
                <p className="text-sm text-gray-400">$45,230</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

