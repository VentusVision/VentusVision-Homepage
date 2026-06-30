import { memo } from "react";

export const CatalogHighlight = memo(function CatalogHighlight({
  text,
  query,
  on,
}: {
  text: string;
  query: string;
  on: boolean;
}) {
  if (!on || !query.trim()) return <>{text}</>;
  const words = query.trim().split(/\s+/).filter(Boolean);
  const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <mark key={i} className="rounded bg-brand/15 font-semibold not-italic text-brand">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
});
