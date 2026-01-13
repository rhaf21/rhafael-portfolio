"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function TextReveal({
  text,
  className,
  delay = 0,
  once = true,
}: TextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      className={cn("inline-block", className)}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "100%", opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.5,
                  delay: delay + i * 0.1,
                  ease: [0.33, 1, 0.68, 1],
                },
              },
            }}
          >
            {word}
            {i < words.length - 1 && "\u00A0"}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

interface LetterRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function LetterReveal({
  text,
  className,
  delay = 0,
  once = true,
}: LetterRevealProps) {
  const letters = text.split("");

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      className={cn("inline-block", className)}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.3,
                delay: delay + i * 0.03,
                ease: "easeOut",
              },
            },
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
