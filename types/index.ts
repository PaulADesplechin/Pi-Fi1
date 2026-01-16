// Types globaux pour l'application Pifi

export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface Alert {
  id: string;
  symbol: string;
  name: string;
  type: "up" | "down" | "both";
  change: number;
  threshold: number;
  timestamp: string;
  assetType: "crypto" | "stock";
  active?: boolean;
}

export interface Crypto {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_data?: number[];
  image?: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  sparkline_data?: number[];
}

export interface Favorite {
  id: string;
  symbol: string;
  name: string;
  type: "crypto" | "stock";
  price: number;
  change: number;
  sparkline_data?: number[];
}

export interface Stats {
  totalCrypto: number;
  totalStocks: number;
  activeAlerts: number;
  totalValue: number;
  favorites: number;
  historyCount: number;
}

export interface NotificationHook {
  permission: "default" | "granted" | "denied";
  requestPermission: () => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => void;
  isSupported: boolean;
}

