import { Moon, Sun, Activity } from "lucide-react";

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-2.5">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-pulse/10 text-pulse">
          <Activity size={20} strokeWidth={2.4} />
        </span>
        <span className="font-display font-semibold text-lg tracking-tight text-ink">
          Page Pulse
        </span>
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-line text-ink-muted hover:text-pulse hover:border-pulse transition-colors"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
