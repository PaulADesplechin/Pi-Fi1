import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Thème sombre + bleu électrique
        dark: {
          bg: "#0a0e27",
          surface: "#0f1629",
          card: "#151b2e",
          border: "#1e2640",
        },
        electric: {
          blue: "#00d4ff",
          "blue-dark": "#0099cc",
          "blue-light": "#33ddff",
          neon: "#00ffff",
        },
        accent: {
          purple: "#8b5cf6",
          pink: "#ec4899",
          cyan: "#06b6d4",
        },
      },
              backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                "mesh-gradient": "radial-gradient(at 0% 0%, rgba(0, 212, 255, 0.1) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(6, 182, 212, 0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(0, 212, 255, 0.1) 0px, transparent 50%)",
              },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseNeon: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(0, 212, 255, 0.5)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 30px rgba(0, 212, 255, 0.8)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 212, 255, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.8), 0 0 30px rgba(0, 212, 255, 0.4)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;

