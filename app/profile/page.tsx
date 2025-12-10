"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Settings, LogOut, Edit2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setEmail(userData.email || "");
    } else if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleSave = async () => {
    // Sauvegarder les modifications
    const updatedUser = { ...user, email };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
          <User className="w-10 h-10 text-electric-blue" />
          Mon Profil
        </h1>
        <p className="text-gray-400">Gérez vos informations personnelles</p>
      </motion.div>

      {/* Carte Profil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-xl p-8 mb-6"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-electric-blue to-accent-purple flex items-center justify-center text-3xl font-bold text-white">
              {user.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {user.email?.split("@")[0] || "Utilisateur"}
              </h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Modifier
            </motion.button>
          ) : (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsEditing(false);
                  setEmail(user.email);
                }}
                className="btn-secondary flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Annuler
              </motion.button>
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-dark-card rounded-lg">
            <Mail className="w-5 h-5 text-electric-blue" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">Email</p>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field mt-1"
                />
              ) : (
                <p className="text-white font-semibold">{user.email}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-dark-card rounded-lg">
            <Calendar className="w-5 h-5 text-electric-blue" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">Membre depuis</p>
              <p className="text-white font-semibold">
                {user.createdAt
                  ? format(new Date(user.createdAt), "dd MMMM yyyy", { locale: fr })
                  : "Récemment"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-dark-card rounded-lg">
            <User className="w-5 h-5 text-electric-blue" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">ID Utilisateur</p>
              <p className="text-white font-semibold font-mono text-sm">{user.id}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-electric-blue mb-2">
            {localStorage.getItem("favorites")
              ? JSON.parse(localStorage.getItem("favorites")!).length
              : 0}
          </p>
          <p className="text-gray-400">Favoris</p>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-accent-purple mb-2">
            {localStorage.getItem("alertHistory")
              ? JSON.parse(localStorage.getItem("alertHistory")!).length
              : 0}
          </p>
          <p className="text-gray-400">Alertes reçues</p>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-accent-cyan mb-2">
            {localStorage.getItem("alerts")
              ? JSON.parse(localStorage.getItem("alerts")!).filter((a: any) => a.active).length
              : 0}
          </p>
          <p className="text-gray-400">Alertes actives</p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-electric-blue" />
          Actions
        </h3>
        <div className="space-y-3">
          <Link href="/settings">
            <button className="w-full btn-secondary text-left flex items-center gap-3">
              <Settings className="w-5 h-5" />
              Paramètres
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full btn-secondary text-left flex items-center gap-3 text-red-400 hover:text-red-500 hover:border-red-500/50"
          >
            <LogOut className="w-5 h-5" />
            Se déconnecter
          </button>
        </div>
      </motion.div>
    </div>
  );
}

