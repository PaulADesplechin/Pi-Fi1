"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, TrendingUp, Bell, Brain, Settings, Info } from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: TrendingUp },
  { href: "/crypto", label: "Crypto", icon: TrendingUp },
  { href: "/stocks", label: "Actions", icon: TrendingUp },
  { href: "/alerts", label: "Alertes", icon: Bell },
  { href: "/assistant", label: "Assistant IA", icon: Brain },
  { href: "/settings", label: "Paramètres", icon: Settings },
  { href: "/about", label: "À propos", icon: Info },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-dark-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-circle.svg"
              alt="Pifi"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold gradient-text hidden sm:block">
              Pifi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-electric-blue/20 text-electric-blue border border-electric-blue/30"
                      : "text-gray-300 hover:text-electric-blue hover:bg-dark-card"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-electric-blue"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-dark-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-electric-blue/20 text-electric-blue border border-electric-blue/30"
                        : "text-gray-300 hover:text-electric-blue hover:bg-dark-card"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

