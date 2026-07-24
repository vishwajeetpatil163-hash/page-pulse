import { Search, Loader2 } from "lucide-react";

export default function UrlForm({ url, onUrlChange, onSubmit, isLoading }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-surface border border-line shadow-card">
        <div className="flex items-center flex-1 gap-2.5 px-3">
          <Search size={18} className="text-ink-muted shrink-0" />
          <input
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck="false"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="example.com"
            aria-label="Website URL to audit"
            className="w-full bg-transparent py-3 text-ink placeholder:text-ink-muted font-mono text-[15px] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-pulse text-white font-display font-semibold tracking-tight transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Scanning
            </>
          ) : (
            "Run audit"
          )}
        </button>
      </div>
    </form>
  );
}
