"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Sun, Globe, Shield, User, Palette } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState("fr");
  const darkMode = theme === "dark";

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotifications(true);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Paramètres</h1>
        <p className="text-gray-400">Personnalisez votre expérience</p>
      </motion.div>

      <div className="space-y-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-electric-blue/20 rounded-lg">
              <Bell className="w-6 h-6 text-electric-blue" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">Notifications</h3>
              <p className="text-gray-400 text-sm">
                Recevez des alertes en temps réel
              </p>
            </div>
            <button
              onClick={() => {
                if (!notifications) {
                  requestNotificationPermission();
                } else {
                  setNotifications(false);
                }
              }}
              className={`w-12 h-6 rounded-full transition-all ${
                notifications ? "bg-electric-blue" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-accent-purple/20 rounded-lg">
              {darkMode ? (
                <Moon className="w-6 h-6 text-accent-purple" />
              ) : (
                <Sun className="w-6 h-6 text-accent-purple" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">Apparence</h3>
              <p className="text-gray-400 text-sm">Mode sombre activé</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-all ${
                darkMode ? "bg-electric-blue" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-accent-cyan/20 rounded-lg">
              <Globe className="w-6 h-6 text-accent-cyan" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">Langue</h3>
              <p className="text-gray-400 text-sm">Sélectionnez votre langue</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field w-32"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </motion.div>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-electric-blue/20 rounded-lg">
              <User className="w-6 h-6 text-electric-blue" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">Compte</h3>
              <p className="text-gray-400 text-sm">Gérez votre profil</p>
            </div>
            <button className="btn-secondary">Modifier</button>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-electric-blue/20 rounded-lg">
              <Shield className="w-6 h-6 text-electric-blue" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">Sécurité</h3>
              <p className="text-gray-400 text-sm">Protégez votre compte</p>
            </div>
            <button className="btn-secondary">Modifier le mot de passe</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

