import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "strong";
  bordered?: boolean;
  padded?: boolean;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      className,
      tone = "default",
      bordered = false,
      padded = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-3xl text-[var(--foreground)]",
          tone === "strong" ? "glass-surface-strong" : "glass-surface",
          bordered && "gradient-border",
          padded && "p-8 md:p-12",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";
