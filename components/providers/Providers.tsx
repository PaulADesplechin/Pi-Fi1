"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AppContextType {
  isConnected: boolean;
  user: any;
  alerts: any[];
  setAlerts: (alerts: any[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function Providers({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
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
          }
        } catch (error) {
          console.error("Erreur récupération utilisateur:", error);
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
          transports: ["websocket"],
        });

        socket.on("connect", () => {
          setIsConnected(true);
          console.log("Connecté au serveur WebSocket");
          const currentToken = localStorage.getItem("token");
          const userId = currentToken ? JSON.parse(atob(currentToken.split(".")[1])).id : "demo-user";
          socket.emit("subscribe-alerts", userId);
        });

        socket.on("disconnect", () => {
          setIsConnected(false);
          console.log("Déconnecté du serveur WebSocket");
        });

        socket.on("alert", (alert: any) => {
          setAlerts((prev) => [alert, ...prev]);
          // Notification browser
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`Alerte ${alert.type}`, {
              body: `${alert.symbol} : ${alert.change}%`,
              icon: "/logo-circle.svg",
            });
          }
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
  }, []);

  return (
    <AppContext.Provider value={{ isConnected, user, alerts, setAlerts }}>
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

