// Utilitaire pour les appels API avec gestion d'erreur

const getApiUrl = (): string => {
  if (typeof window === "undefined") {
    // Côté serveur
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }
  // Côté client
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network Error: Impossible de se connecter au serveur backend");
      console.error("Vérifiez que le serveur backend est démarré sur", apiUrl);
      throw new Error("Impossible de se connecter au serveur. Vérifiez que le backend est démarré.");
    }
    throw error;
  }
};

export const apiGet = async <T>(endpoint: string, token?: string): Promise<T> => {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiRequest(endpoint, {
    method: "GET",
    headers,
  });

  return response.json();
};

export const apiPost = async <T>(
  endpoint: string,
  data: unknown,
  token?: string
): Promise<T> => {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiRequest(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  return response.json();
};

export const apiDelete = async <T>(endpoint: string, token?: string): Promise<T> => {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiRequest(endpoint, {
    method: "DELETE",
    headers,
  });

  return response.json();
};

export const apiPatch = async <T>(
  endpoint: string,
  data: unknown,
  token?: string
): Promise<T> => {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiRequest(endpoint, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  return response.json();
};

