import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "primary" | "secondary" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--border)] text-[var(--foreground)]",
  primary: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800",
  secondary: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  outline: "border border-[var(--border)] bg-transparent text-[var(--foreground)]",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
