import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="card-enter flex items-start gap-3 px-4 py-3.5 rounded-xl border border-crit/30 bg-crit/5 text-sm"
    >
      <AlertTriangle size={18} className="text-crit shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-crit">Audit failed</p>
        <p className="text-ink-muted mt-0.5">{message}</p>
      </div>
    </div>
  );
}
