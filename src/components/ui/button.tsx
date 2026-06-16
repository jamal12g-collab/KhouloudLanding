import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-pearl px-5 text-ink shadow-glow hover:-translate-y-0.5 hover:bg-white focus-visible:outline-rosegold",
        variant === "secondary" && "border border-white/20 bg-white/10 px-5 text-white backdrop-blur hover:bg-white/18 focus-visible:outline-rosegold",
        variant === "ghost" && "text-white hover:bg-white/10 focus-visible:outline-rosegold",
        variant === "danger" && "bg-red-500 px-5 text-white hover:bg-red-400 focus-visible:outline-red-300",
        size === "sm" && "h-9 text-sm",
        size === "md" && "h-11 text-sm",
        size === "lg" && "h-12 px-7 text-base",
        size === "icon" && "size-11 p-0",
        className
      )}
      {...props}
    />
  );
}
