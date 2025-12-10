"use client";

import { useEffect, useState } from "react";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      return perm === "granted";
    }
    return false;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        icon: "/logo-icon.svg",
        badge: "/logo-icon.svg",
        ...options,
      });
    }
  };

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported: "Notification" in window,
  };
}

