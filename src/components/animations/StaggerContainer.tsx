import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  once?: boolean;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerContainerProps) {
  const items = Children.toArray(children);
  return (
    <div className={cn(className)}>
      {items.map((child, i) => {
        if (!isValidElement(child)) return child;
        const childProps = child.props as {
          ["data-delay"]?: string | number;
        };
        const existing = childProps["data-delay"];
        return cloneElement(child as React.ReactElement<{ "data-delay"?: number }>, {
          "data-delay":
            existing !== undefined
              ? Number(existing)
              : Math.round(i * staggerDelay * 1000),
        });
      })}
    </div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function StaggerItem({ children, className, delay }: StaggerItemProps) {
  return (
    <div
      data-reveal
      data-delay={delay !== undefined ? Math.round(delay * 1000) : undefined}
      className={cn(className)}
    >
      {children}
    </div>
  );
}
