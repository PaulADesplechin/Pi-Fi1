"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp, Bell, Brain, BarChart3, Zap } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Bell,
      title: "Alertes Automatiques",
      description: "Notifications instantanées dès 3-5% de variation sur vos cryptos et actions préférées",
      color: "text-electric-blue",
    },
    {
      icon: Brain,
      title: "Assistant IA",
      description: "Coach financier quotidien pour comprendre les tendances et les mouvements du marché",
      color: "text-accent-purple",
    },
    {
      icon: BarChart3,
      title: "Graphiques Animés",
      description: "Visualisez l'évolution de vos actifs avec des graphiques interactifs en temps réel",
      color: "text-accent-cyan",
    },
    {
      icon: Zap,
      title: "Liens d'Achat Directs",
      description: "Accès rapide vers Binance, Kraken et autres plateformes populaires",
      color: "text-electric-blue",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-blue opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple opacity-10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8 flex justify-center"
            >
              <img
                src="/logo-circle.svg"
                alt="Pifi Logo"
                className="w-24 h-24 animate-pulse-neon"
              />
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
              Pifi
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-4">
              Votre Coach Financier Quotidien
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Alertes automatiques sur cryptomonnaies et actions • Assistant IA intégré • 
              Liens directs vers les plateformes d'achat
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
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
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  En savoir plus
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Fonctionnalités
            </h2>
            <p className="text-gray-400 text-lg">
              Tout ce dont vous avez besoin pour suivre vos investissements
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="glass rounded-xl p-6 card-hover"
                >
                  <div className={`${feature.color} mb-4`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong rounded-2xl p-12 text-center max-w-3xl mx-auto"
          >
            <TrendingUp className="w-16 h-16 text-electric-blue mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Prêt à commencer ?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Rejoignez Pifi et ne manquez plus jamais une opportunité d'investissement
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                Accéder au Dashboard
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

