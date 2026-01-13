"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Direction = "left" | "right" | "up" | "down";

interface SlideInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
  className?: string;
  once?: boolean;
}

const directionOffsets: Record<Direction, { x?: string; y?: string }> = {
  left: { x: "-100%" },
  right: { x: "100%" },
  up: { y: "100%" },
  down: { y: "-100%" },
};

export function SlideIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "left",
  className,
  once = true,
}: SlideInProps) {
  return (
    <motion.div
      initial={{ ...directionOffsets[direction], opacity: 0 }}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
