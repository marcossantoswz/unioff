import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={[
        "bg-white rounded-2xl border border-slate-100 shadow-sm",
        hover ? "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" : "",
        paddings[padding],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
