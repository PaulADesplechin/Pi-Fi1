import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pifi - Alertes Crypto & Actions | Assistant IA Financier",
  description: "Application moderne d'alertes automatiques sur les cryptomonnaies et actions avec assistant IA intégré. Recevez des notifications dès 3-5% de variation.",
  keywords: "cryptomonnaies, alertes crypto, actions boursières, assistant IA financier, Binance, Kraken",
  authors: [{ name: "Pifi Team" }],
  openGraph: {
    title: "Pifi - Alertes Crypto & Actions",
    description: "Votre coach financier quotidien alimenté par l'IA",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#0a0e27",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo-favicon.svg", type: "image/svg+xml" },
      { url: "/logo-icon.svg", sizes: "64x64", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/logo-icon.svg", sizes: "64x64", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="icon" href="/logo-favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo-icon.svg" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-dark-bg">
            <Navbar />
            <main className="pt-20">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

