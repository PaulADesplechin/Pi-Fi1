"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp, Bell, Brain, BarChart3, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-block mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-electric-blue to-accent-purple rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-electric-blue/50">
            Pifi
          </div>
        </motion.div>
        
        <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6">
          Votre Coach Financier
          <br />
          <span className="text-electric-blue">Intelligent</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Alertes automatiques sur les cryptomonnaies et actions. 
          Assistant IA intégré pour vous aider à faire les meilleurs choix.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link href="/crypto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-4"
            >
              Explorer les cryptos
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 relative z-10">
        {[
          {
            icon: Bell,
            title: "Alertes Automatiques",
            description: "Recevez des notifications dès 3-5% de variation sur vos actifs favoris",
            color: "text-electric-blue",
            bgColor: "bg-electric-blue/10",
          },
          {
            icon: Brain,
            title: "Assistant IA",
            description: "Obtenez des conseils personnalisés et des analyses de marché en temps réel",
            color: "text-accent-purple",
            bgColor: "bg-accent-purple/10",
          },
          {
            icon: BarChart3,
            title: "Graphiques Avancés",
            description: "Visualisez les tendances avec des graphiques interactifs et détaillés",
            color: "text-accent-cyan",
            bgColor: "bg-accent-cyan/10",
          },
          {
            icon: TrendingUp,
            title: "Suivi en Temps Réel",
            description: "Suivez les prix des cryptomonnaies et actions en direct",
            color: "text-electric-blue",
            bgColor: "bg-electric-blue/10",
          },
          {
            icon: Zap,
            title: "Notifications Instantanées",
            description: "Soyez alerté instantanément via notifications push et WebSocket",
            color: "text-accent-purple",
            bgColor: "bg-accent-purple/10",
          },
          {
            icon: Brain,
            title: "Recommandations Intelligentes",
            description: "L'IA analyse le marché et vous suggère les meilleures opportunités",
            color: "text-accent-cyan",
            bgColor: "bg-accent-cyan/10",
          },
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-xl p-6 card-hover"
            >
              <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center relative z-10"
      >
        <div className="glass-strong rounded-2xl p-12 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez des milliers d'investisseurs qui font confiance à Pifi
          </p>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              Accéder au Dashboard
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
