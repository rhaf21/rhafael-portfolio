import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type GlassVariant = "frosted" | "strong" | "bordered-gradient";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  interactive?: boolean;
  as?: "div" | "article" | "section" | "li";
}

const surfaceClasses: Record<GlassVariant, string> = {
  frosted: "glass-surface",
  strong: "glass-surface-strong",
  "bordered-gradient": "glass-surface gradient-border",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant = "frosted",
      interactive = false,
      as: Tag = "div",
      children,
      ...props
    },
    ref
  ) => {
    const Component = Tag as "div";
    return (
      <Component
        ref={ref}
        className={cn(
          "relative rounded-2xl p-6 text-[var(--foreground)]",
          surfaceClasses[variant],
          interactive &&
            "transition-transform duration-300 [--gb-angle:0deg] hover:-translate-y-1 hover:shadow-[0_0_40px_-12px_var(--glow-lime)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GlassCard.displayName = "GlassCard";
