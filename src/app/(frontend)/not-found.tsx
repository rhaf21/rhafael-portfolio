"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Container } from "@/components/layout";

export default function NotFound() {
  return (
    <Container className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-[8rem] md:text-[12rem] font-bold leading-none neon-glow">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Looks like you&apos;ve ventured into uncharted territory.
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg font-medium px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-lg font-medium px-6 py-3 border border-border hover:bg-card transition-colors"
          >
            View Projects
          </Link>
        </motion.div>

        {/* Easter egg: animated code block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 text-left max-w-md mx-auto"
        >
          <pre className="font-mono text-xs text-muted-foreground/50 p-4 rounded-lg bg-card/50 border border-border/50 overflow-x-auto">
            <code>{`// Error: Page not found
try {
  const page = await fetch(url);
  if (!page.ok) throw new Error();
} catch (e) {
  redirect("/"); // ← You are here
}`}</code>
          </pre>
        </motion.div>
      </div>
    </Container>
  );
}
