"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "font-semibold rounded-lg transition-all flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-electric-blue to-electric-blue-dark text-white hover:shadow-lg hover:shadow-electric-blue/50",
    secondary: "bg-electric-blue/10 text-electric-blue border border-electric-blue/30 hover:bg-electric-blue/20",
    outline: "bg-transparent text-electric-blue border border-electric-blue hover:bg-electric-blue/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="spinner w-4 h-4"></div>
          Chargement...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

