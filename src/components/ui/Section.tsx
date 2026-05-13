import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type SectionTone = "default" | "elevated" | "transparent";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: SectionTone;
}

const toneClasses: Record<SectionTone, string> = {
  default: "",
  elevated: "glass-surface border-y border-[var(--glass-border)]",
  transparent: "",
};

export function Section({
  children,
  className,
  id,
  tone = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-28", toneClasses[tone], className)}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  description,
  eyebrow,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-14",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-primary-500)]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg text-[var(--muted-foreground)]",
            align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
