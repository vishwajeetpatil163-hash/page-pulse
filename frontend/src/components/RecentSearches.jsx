import { History, X } from "lucide-react";

export default function RecentSearches({ searches, onSelect, onClear }) {
  if (!searches.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <span className="flex items-center gap-1.5 text-xs text-ink-muted mr-1">
        <History size={13} />
        Recent
      </span>
      {searches.map((entry) => (
        <button
          key={entry}
          type="button"
          onClick={() => onSelect(entry)}
          className="px-3 py-1.5 rounded-full text-xs font-mono border border-line text-ink-muted hover:text-pulse hover:border-pulse transition-colors max-w-[220px] truncate"
          title={entry}
        >
          {entry.replace(/^https?:\/\//, "")}
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear recent searches"
        className="flex items-center justify-center w-6 h-6 rounded-full text-ink-muted hover:text-crit transition-colors"
      >
        <X size={13} />
      </button>
    </div>
  );
}
