import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const colors = {
    default: "bg-slate-200 text-slate-800",
    success: "bg-emerald-100 text-emerald-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-sm font-medium",
        colors[variant]
      )}
    >
      {children}
    </span>
  );
}
