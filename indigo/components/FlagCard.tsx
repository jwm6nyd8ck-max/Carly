interface Props {
  type: "red" | "green";
  title: string;
  explanation: string;
  source?: string;
  severity?: "high" | "medium" | "low";
}

const SEVERITY_ICONS = {
  high: "⚠️",
  medium: "⚡",
  low: "ℹ️",
};

export default function FlagCard({ type, title, explanation, source, severity }: Props) {
  const isRed = type === "red";

  return (
    <div
      className={`rounded-xl p-4 border ${
        isRed
          ? "bg-[rgba(232,68,51,0.08)] border-[rgba(232,68,51,0.2)]"
          : "bg-[rgba(45,184,122,0.08)] border-[rgba(45,184,122,0.2)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0" aria-hidden="true">
          {isRed ? (severity ? SEVERITY_ICONS[severity] : "⚠️") : "✓"}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-body font-semibold mb-1 ${
              isRed ? "text-[#E84433]" : "text-[#2DB87A]"
            }`}
          >
            {title}
          </p>
          <p className="text-xs font-body text-[#C8B8FF] leading-relaxed">
            {explanation}
          </p>
          {source && (
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block mt-2 text-xs font-body underline underline-offset-2 ${
                isRed
                  ? "text-[rgba(232,68,51,0.7)] hover:text-[#E84433]"
                  : "text-[rgba(45,184,122,0.7)] hover:text-[#2DB87A]"
              }`}
            >
              Source →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
