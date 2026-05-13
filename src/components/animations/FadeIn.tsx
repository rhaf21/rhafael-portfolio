import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Direction = "up" | "down" | "left" | "right";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
  className?: string;
  once?: boolean;
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <div
      data-reveal
      data-delay={Math.round(delay * 1000)}
      className={cn(className)}
    >
      {children}
    </div>
  );
}
