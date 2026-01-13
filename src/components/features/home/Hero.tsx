"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { TextReveal } from "@/components/animations";
import { LiquidBackground } from "@/components/ui/LiquidBackground";

interface HeroProps {
  greeting?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  availableForWork?: boolean;
}

export function Hero({
  greeting = "Hi, I'm Rhafael",
  title = "Shopify & WordPress",
  subtitle = "Developer",
  description = "I build high-converting e-commerce stores on Shopify, custom WordPress themes, and modern React applications that drive results for businesses.",
  availableForWork = true,
}: HeroProps) {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center">
      <Container>
        <div className="max-w-3xl">
          {availableForWork && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                Available for hire
              </span>
            </motion.div>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <TextReveal text={greeting} delay={0.2} />
            <br />
            <span className="text-primary-500 dark:neon-glow">
              <TextReveal text={title} delay={0.4} />
            </span>
            <br />
            <span className="text-[var(--muted)]">
              <TextReveal text={subtitle} delay={0.6} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-lg md:text-xl text-[var(--muted)] mb-8 max-w-2xl"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/projects">
              <Button size="lg">View My Work</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>

      {/* Liquid background effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <LiquidBackground />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-primary-500/50 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-primary-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
