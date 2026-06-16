import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-white/12 bg-white/8 shadow-glass backdrop-blur-xl", className)} {...props} />;
}
