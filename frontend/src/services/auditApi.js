// Base URL for the Page Pulse API. In development this falls back to the
// local backend; in production it's injected at build time by Vercel.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Custom error carrying the structured error payload the API returns,
 * so the UI can show a specific message instead of a generic one.
 */
export class AuditApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AuditApiError";
    this.code = code;
  }
}

/**
 * Requests an audit for the given URL from the backend.
 *
 * @param {string} url
 * @returns {Promise<object>} the audit report
 */
export async function runAudit(url) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch (err) {
    throw new AuditApiError(
      "Couldn't reach the Page Pulse API. Check your connection and try again.",
      "NETWORK_ERROR"
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch (err) {
    throw new AuditApiError("The server returned an unexpected response.", "PARSE_ERROR");
  }

  if (!response.ok) {
    throw new AuditApiError(
      payload?.error?.message || "The audit could not be completed.",
      payload?.error?.code || "UNKNOWN_ERROR"
    );
  }

  return payload;
}
