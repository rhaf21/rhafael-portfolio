import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface RevealRootProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}

export function RevealRoot({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: RevealRootProps) {
  const Component = Tag as "div";
  return (
    <Component
      data-reveal
      data-delay={Math.round(delay * 1000)}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
