import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-12 w-full rounded-xl border border-white/12 bg-white/8 px-4 text-sm text-white outline-none backdrop-blur placeholder:text-white/45 focus:border-rosegold focus:ring-2 focus:ring-rosegold/20",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-32 w-full rounded-xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none backdrop-blur placeholder:text-white/45 focus:border-rosegold focus:ring-2 focus:ring-rosegold/20",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-12 w-full rounded-xl border border-white/12 bg-white/8 px-4 text-sm text-white outline-none backdrop-blur focus:border-rosegold focus:ring-2 focus:ring-rosegold/20 [&_option]:bg-ink",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
