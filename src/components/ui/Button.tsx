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
    "bg-primary-600 text-white",
    "hover:bg-primary-700",
    "dark:bg-primary-500 dark:hover:bg-primary-600"
  ),
  secondary: cn(
    "bg-[var(--border)] text-[var(--foreground)]",
    "hover:bg-[var(--muted)]/20"
  ),
  outline: cn(
    "border border-[var(--border)] bg-transparent",
    "hover:bg-[var(--border)]"
  ),
  ghost: cn("bg-transparent", "hover:bg-[var(--border)]"),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
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
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
          "transition-transform transition-colors focus-visible:outline-none",
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
