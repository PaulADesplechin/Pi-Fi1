"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Brain, Heart } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const features = [
    {
      icon: Zap,
      title: "Rapide & Efficace",
      description: "Alertes instantanées dès qu'une opportunité se présente",
      color: "text-electric-blue",
    },
    {
      icon: Shield,
      title: "Sécurisé",
      description: "Vos données sont protégées et chiffrées",
      color: "text-accent-purple",
    },
    {
      icon: Brain,
      title: "Intelligent",
      description: "Assistant IA pour vous guider dans vos décisions",
      color: "text-accent-cyan",
    },
    {
      icon: Heart,
      title: "Fait avec passion",
      description: "Une équipe dédiée à votre succès financier",
      color: "text-accent-purple",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-8 flex justify-center"
        >
          <Image
            src="/logo-circle.svg"
            alt="Pifi Logo"
            width={120}
            height={120}
            className="w-30 h-30"
          />
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
          À propos de Pifi
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Pifi est votre compagnon intelligent pour suivre et investir dans les cryptomonnaies et les actions.
          Nous combinons technologie de pointe et simplicité pour vous offrir la meilleure expérience.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-8 mb-12 max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-4 gradient-text">Notre Mission</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          Démocratiser l'accès aux informations financières et aux opportunités d'investissement.
          Nous croyons que tout le monde devrait avoir accès à des outils professionnels pour gérer
          ses investissements, sans la complexité des plateformes traditionnelles.
        </p>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-xl p-6 card-hover text-center"
            >
              <div className={`${feature.color} mb-4 flex justify-center`}>
                <Icon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-xl p-8 max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-6 gradient-text text-center">
          Technologies Utilisées
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Next.js 15", "React", "TypeScript", "TailwindCSS", "Framer Motion", "Recharts", "Express", "MongoDB"].map(
            (tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.05 }}
                className="bg-dark-card p-4 rounded-lg text-center border border-dark-border"
              >
                <p className="text-white font-semibold">{tech}</p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-center mt-12"
      >
        <h2 className="text-3xl font-bold mb-4 gradient-text">Contactez-nous</h2>
        <p className="text-gray-400 mb-6">
          Des questions ? Des suggestions ? Nous sommes là pour vous aider.
        </p>
        <a href="mailto:contact@pifi.app" className="btn-primary inline-block">
          Envoyer un email
        </a>
      </motion.div>
    </div>
  );
}

