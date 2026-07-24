import { useState } from "react";
import PulseLine from "../components/PulseLine";
import UrlForm from "../components/UrlForm";
import RecentSearches from "../components/RecentSearches";
import ErrorMessage from "../components/ErrorMessage";
import ReportSkeleton from "../components/ReportSkeleton";
import ReportGrid from "../components/ReportGrid";
import ReportActions from "../components/ReportActions";
import { runAudit, AuditApiError } from "../services/auditApi";
import { useRecentSearches } from "../hooks/useRecentSearches";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [auditedUrl, setAuditedUrl] = useState("");

  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();

  async function handleSubmit() {
    if (!url.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await runAudit(url.trim());
      setReport(result);
      setAuditedUrl(url.trim());
      addRecentSearch(url.trim());
    } catch (err) {
      const message =
        err instanceof AuditApiError ? err.message : "Something unexpected went wrong.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectRecent(entry) {
    setUrl(entry);
  }

  return (
    <div>
      <section className="pt-6 pb-2">
        <PulseLine isScanning={isLoading} />
        <div className="text-center mt-2">
          <h1 className="font-display font-semibold text-3xl md:text-[2.75rem] leading-tight tracking-tight text-ink">
            Check any website's vital signs
          </h1>
          <p className="text-ink-muted mt-3 max-w-lg mx-auto text-[15px]">
            Page Pulse scans a URL and reads back performance, SEO basics, and
            accessibility signals in seconds.
          </p>
        </div>
      </section>

      <section className="mt-8 max-w-2xl mx-auto">
        <UrlForm url={url} onUrlChange={setUrl} onSubmit={handleSubmit} isLoading={isLoading} />
        <RecentSearches
          searches={recentSearches}
          onSelect={handleSelectRecent}
          onClear={clearRecentSearches}
        />

        <div className="mt-6">
          {error && <ErrorMessage message={error} />}
          {isLoading && <ReportSkeleton />}
          {!isLoading && report && (
            <>
              <ReportGrid report={report} />
              <ReportActions report={report} auditedUrl={auditedUrl} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
