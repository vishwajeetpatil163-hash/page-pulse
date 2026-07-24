/**
 * reportMetrics.js
 *
 * Translates the raw JSON the API returns into the ordered list of cards
 * the UI renders, each carrying a status ("good" | "warn" | "crit") used
 * to color its indicator dot.
 */

function statusForHttpStatus(status) {
  if (status >= 200 && status < 300) return "good";
  if (status >= 300 && status < 400) return "warn";
  return "crit";
}

function statusForResponseTime(ms) {
  if (ms < 500) return "good";
  if (ms < 1500) return "warn";
  return "crit";
}

function statusForH1Count(count) {
  if (count === 1) return "good";
  return "warn";
}

function statusForMissingAlt(count) {
  if (count === 0) return "good";
  if (count <= 5) return "warn";
  return "crit";
}

function statusForText(text, fallback) {
  return text && text !== fallback ? "good" : "warn";
}

/**
 * @param {object} report - the audit JSON from POST /api/audit
 * @returns {Array<{ key, label, value, hint, status }>}
 */
export function buildMetricCards(report) {
  return [
    {
      key: "status",
      label: "HTTP status",
      value: String(report.status),
      hint: "Response code returned by the server",
      status: statusForHttpStatus(report.status),
    },
    {
      key: "responseTime",
      label: "Response time",
      value: `${report.responseTime} ms`,
      hint: "Time to receive the full response",
      status: statusForResponseTime(report.responseTime),
    },
    {
      key: "h1Count",
      label: "H1 headings",
      value: String(report.h1Count),
      hint: "Pages should have exactly one H1",
      status: statusForH1Count(report.h1Count),
    },
    {
      key: "imagesMissingAlt",
      label: "Images missing alt text",
      value: String(report.imagesMissingAlt),
      hint: "Alt text matters for accessibility & SEO",
      status: statusForMissingAlt(report.imagesMissingAlt),
    },
    {
      key: "wordCount",
      label: "Word count",
      value: report.wordCount.toLocaleString(),
      hint: "Approximate visible body word count",
      status: "neutral",
    },
    {
      key: "title",
      label: "Page title",
      value: report.title,
      hint: "The <title> tag content",
      status: statusForText(report.title, "Untitled page"),
      isLong: true,
    },
    {
      key: "metaDescription",
      label: "Meta description",
      value: report.metaDescription,
      hint: "Shown in search engine results",
      status: statusForText(report.metaDescription, "No meta description found"),
      isLong: true,
    },
  ];
}
