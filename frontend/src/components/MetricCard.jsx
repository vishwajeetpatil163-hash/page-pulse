const DOT_COLOR = {
  good: "bg-pulse",
  warn: "bg-warn",
  crit: "bg-crit",
  neutral: "bg-ink-muted",
};

export default function MetricCard({ label, value, hint, status, isLong, style }) {
  return (
    <div
      className={`card-enter rounded-xl border border-line bg-surface p-4 hover:border-pulse/40 transition-colors ${
        isLong ? "col-span-2 md:col-span-3" : ""
      }`}
      style={style}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLOR[status] || DOT_COLOR.neutral}`} />
        <span className="text-xs uppercase tracking-wide text-ink-muted">{label}</span>
      </div>
      <p
        className={`font-mono text-ink font-medium ${
          isLong ? "text-sm break-words" : "text-xl"
        }`}
        title={hint}
      >
        {value}
      </p>
    </div>
  );
}
