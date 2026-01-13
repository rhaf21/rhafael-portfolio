"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Container } from "./Container";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md"
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Image
                src="/logo.png"
                alt="Rhafael"
                width={40}
                height={40}
                className="rounded-full"
              />
            </motion.div>
          </Link>

          <div className="flex items-center gap-4">
            <Navigation />
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
