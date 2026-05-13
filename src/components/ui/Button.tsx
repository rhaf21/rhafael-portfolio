import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-[var(--color-primary-500)] text-black font-semibold",
    "hover:bg-[var(--color-primary-400)]",
    "hover:shadow-[0_0_30px_var(--glow-lime)]",
    "transition-shadow"
  ),
  secondary: cn(
    "glass-surface text-[var(--foreground)]",
    "hover:bg-[var(--glass-bg-strong)]"
  ),
  outline: cn(
    "glass-surface text-[var(--foreground)]",
    "border border-[var(--glass-border-strong)]",
    "hover:border-[var(--color-primary-500)] hover:text-[var(--color-primary-500)]"
  ),
  ghost: cn(
    "bg-transparent text-[var(--foreground)]",
    "hover:bg-[var(--glass-bg)]"
  ),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-full",
  md: "px-5 py-2 text-sm rounded-full",
  lg: "px-7 py-3 text-base rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      type = "button",
      onClick,
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium",
          "transition-all duration-200 focus-visible:outline-none",
          "hover:scale-[1.02] active:scale-[0.98]",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
