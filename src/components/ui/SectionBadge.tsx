import { cn } from "../../lib/utils";

interface SectionBadgeProps {
  label: string;
  pulse?: boolean;
  className?: string;
}

export function SectionBadge({ label, pulse = false, className }: SectionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-subtle px-4 py-1.5 font-bold uppercase tracking-[0.25em] text-brand shadow-sm",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-brand", pulse && "animate-pulse")} />
      {label}
    </span>
  );
}
