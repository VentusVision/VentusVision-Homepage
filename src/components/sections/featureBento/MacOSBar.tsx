import { memo } from "react";

export const MacOSBar = memo(function MacOSBar({ label }: { label: string }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 border-b border-brand/10 bg-base px-4 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      <span className="ml-auto font-mono text-[10px] text-fg-subtle">{label}</span>
    </div>
  );
});
