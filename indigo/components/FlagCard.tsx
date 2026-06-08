interface Props {
  type: "red" | "green";
  title: string;
  explanation: string;
  source?: string;
  severity?: "high" | "medium" | "low";
}

export default function FlagCard({ type, title, explanation, source }: Props) {
  const isRed = type === "red";
  const accentColor = isRed ? "#A0513A" : "#6B8C5F";
  const bgColor = isRed ? "rgba(160,81,58,0.07)" : "rgba(107,140,95,0.07)";
  const borderColor = isRed ? "rgba(160,81,58,0.2)" : "rgba(107,140,95,0.2)";

  return (
    <div style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 4 }} className="px-4 py-3.5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex-shrink-0 text-xs font-body font-medium tracking-widest uppercase" style={{ color: accentColor }}>
          {isRed ? "—" : "+"}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-body" style={{ color: "var(--text-cream)", fontWeight: 400 }}>{title}</p>
          {explanation && (
            <p className="text-xs font-body mt-1 leading-relaxed" style={{ color: "var(--text-warm)" }}>{explanation}</p>
          )}
          {source && (
            <a href={source} target="_blank" rel="noopener noreferrer"
              className="inline-block mt-2 text-xs font-body underline underline-offset-2"
              style={{ color: accentColor }}>
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
