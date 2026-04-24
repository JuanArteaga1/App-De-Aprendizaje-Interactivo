/**
 * TEMPLATE: Componente React profesional
 * - Tipado estricto + forwardRef
 * - Variantes con CVA
 * - Accesible (focus-visible, aria-*)
 * - Estados: default, hover, focus, active, disabled, loading
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const componentVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-lg font-medium transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
      },
      fullWidth: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ComponentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof componentVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Component = React.forwardRef<HTMLButtonElement, ComponentProps>(
  (
    { className, variant, size, fullWidth, isLoading, leftIcon, rightIcon, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(componentVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Component.displayName = "Component";
