import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";

export default function ReportActions({ report, auditedUrl }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.warn("Clipboard write failed.", err);
    }
  }

  function handleDownload() {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const hostname = auditedUrl.replace(/^https?:\/\//, "").replace(/[/:]/g, "-");
    const link = document.createElement("a");
    link.href = url;
    link.download = `page-pulse-${hostname}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-line text-ink-muted hover:text-pulse hover:border-pulse transition-colors"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied" : "Copy JSON"}
      </button>
      <button
        type="button"
        onClick={handleDownload}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-line text-ink-muted hover:text-pulse hover:border-pulse transition-colors"
      >
        <Download size={14} />
        Download report
      </button>
    </div>
  );
}
