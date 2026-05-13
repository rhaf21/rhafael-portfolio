"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";

const LiquidBackground = dynamic(
  () => import("./LiquidBackground").then((m) => m.LiquidBackground),
  { ssr: false }
);

type AmbientVariant = "ambient" | "kinetic" | "canvas";

interface AmbientBackdropProps {
  variant?: AmbientVariant;
  className?: string;
  fixed?: boolean;
}

function subscribeToFinePointer(callback: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getFinePointerSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}

function getFinePointerServerSnapshot() {
  return false;
}

export function AmbientBackdrop({
  variant = "ambient",
  className,
  fixed = false,
}: AmbientBackdropProps) {
  const reduced = useReducedMotion();
  const finePointer = useSyncExternalStore(
    subscribeToFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot
  );
  const supportsCanvas = variant === "canvas" && finePointer && !reduced;

  const blobs = (
    <>
      <div
        className="ambient-blob"
        style={{
          top: "-10%",
          left: "-5%",
          width: "55vmax",
          height: "55vmax",
          background:
            "radial-gradient(closest-side, oklch(0.88 0.32 130 / 0.55), transparent 70%)",
        }}
      />
      <div
        className="ambient-blob"
        style={{
          top: "30%",
          right: "-10%",
          width: "40vmax",
          height: "40vmax",
          background:
            "radial-gradient(closest-side, oklch(0.78 0.30 130 / 0.45), transparent 70%)",
        }}
      />
      <div
        className="ambient-blob"
        style={{
          bottom: "-15%",
          left: "20%",
          width: "60vmax",
          height: "60vmax",
          background:
            "radial-gradient(closest-side, oklch(0.62 0.26 130 / 0.35), transparent 70%)",
        }}
      />
    </>
  );

  if (supportsCanvas) {
    return (
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className={cn(
          "pointer-events-none overflow-hidden",
          fixed ? "fixed inset-0 -z-10" : "absolute inset-0 -z-10",
          className
        )}
      >
        <LiquidBackground />
        {blobs}
      </motion.div>
    );
  }

  if (variant === "kinetic" && !reduced) {
    return (
      <div
        aria-hidden
        className={cn(
          "pointer-events-none overflow-hidden",
          fixed ? "fixed inset-0 -z-10" : "absolute inset-0 -z-10",
          className
        )}
      >
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {blobs}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none overflow-hidden",
        fixed ? "fixed inset-0 -z-10" : "absolute inset-0 -z-10",
        className
      )}
    >
      {blobs}
    </div>
  );
}
