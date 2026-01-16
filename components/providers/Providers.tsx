"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import type { User, Alert } from "@/types";

interface AppContextType {
  isConnected: boolean;
  user: User | null;
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  notifications: ReturnType<typeof useNotifications>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function Providers({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const notifications = useNotifications();

  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === "undefined") return;

    // Demander la permission de notification au démarrage
    if (notifications.isSupported && notifications.permission === "default") {
      notifications.requestPermission();
    }

    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("token");
    
    if (token) {
      setIsConnected(true);
      // Récupérer les données utilisateur
      const fetchUser = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
          const response = await fetch(`${apiUrl}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.warn("Erreur récupération utilisateur:", response.status);
          }
        } catch (error) {
          console.error("Erreur récupération utilisateur:", error);
          // Ne pas bloquer l'application si le backend n'est pas disponible
        }
      };
      fetchUser();
    }

    // Connexion WebSocket pour les alertes en temps réel
    let socket: any = null;
    
    const initSocket = async () => {
      try {
        const { io } = await import("socket.io-client");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        socket = io(apiUrl, {
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
          timeout: 20000,
        });

        socket.on("connect", () => {
          setIsConnected(true);
          console.log("Connecté au serveur WebSocket");
          if (typeof window !== "undefined") {
            const currentToken = localStorage.getItem("token");
            const userId = currentToken ? JSON.parse(atob(currentToken.split(".")[1])).id : "demo-user";
            socket.emit("subscribe-alerts", userId);
          }
        });

        socket.on("disconnect", () => {
          setIsConnected(false);
          console.log("Déconnecté du serveur WebSocket");
        });

        socket.on("alert", (alert: Alert) => {
          setAlerts((prev) => [alert, ...prev]);
          
          // Sauvegarder dans l'historique (uniquement côté client)
          if (typeof window !== "undefined") {
            const history = localStorage.getItem("alertHistory") || "[]";
            const histArray = JSON.parse(history);
            histArray.unshift({
              id: alert.id,
              symbol: alert.symbol,
              name: alert.name,
              type: alert.type,
              change: parseFloat(alert.change),
              threshold: alert.threshold,
              timestamp: alert.timestamp,
              assetType: alert.assetType,
            });
            localStorage.setItem("alertHistory", JSON.stringify(histArray.slice(0, 100))); // Garder les 100 dernières
          }
          
          // Notification browser
          notifications.showNotification(`Alerte ${alert.type === "up" ? "📈 Hausse" : "📉 Baisse"}`, {
            body: `${alert.symbol} : ${alert.change}% (${alert.name})`,
            icon: "/logo-icon.svg",
            badge: "/logo-icon.svg",
            tag: `alert-${alert.id}`,
            requireInteraction: false,
          });
        });
      } catch (error) {
        console.error("Erreur connexion WebSocket:", error);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [notifications]);

  return (
    <AppContext.Provider value={{ isConnected, user, alerts, setAlerts, notifications }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within Providers");
  }
  return context;
}
