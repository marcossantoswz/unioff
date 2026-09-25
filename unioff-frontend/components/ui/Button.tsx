import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus:ring-indigo-500",
  secondary:
    "bg-purple-600 hover:bg-purple-700 text-white shadow-sm focus:ring-purple-500",
  outline:
    "border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
  ghost:
    "text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
