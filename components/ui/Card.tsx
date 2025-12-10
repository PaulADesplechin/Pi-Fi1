"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function Card({ children, className, hover = true, glow = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5 } : {}}
      className={clsx(
        "glass rounded-xl p-6",
        hover && "card-hover",
        glow && "animate-pulse-neon",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

