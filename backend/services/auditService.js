/**
 * auditService.js
 *
 * Orchestrates a single website audit:
 *  1. Fetch the page (timing the request)
 *  2. Confirm it's an HTML response
 *  3. Parse it for the signals Page Pulse reports
 *
 * Throws an AuditError (see below) for every failure mode so the
 * controller can translate it into a consistent JSON error response.
 */

const axios = require("axios");
const { parseHtml } = require("../utils/htmlParser");

const FETCH_TIMEOUT_MS = Number(process.env.FETCH_TIMEOUT_MS) || 8000;
const MAX_CONTENT_LENGTH = Number(process.env.MAX_CONTENT_LENGTH) || 5_000_000;

/**
 * Custom error type carrying an HTTP status code so the controller layer
 * can respond appropriately without re-inspecting error internals.
 */
class AuditError extends Error {
  constructor(message, statusCode = 500, code = "AUDIT_FAILED") {
    super(message);
    this.name = "AuditError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Fetches a URL and returns the audit report described in the API contract.
 *
 * @param {string} url - Fully-qualified, already-validated URL.
 * @returns {Promise<object>} audit result
 */
async function auditUrl(url) {
  const startedAt = Date.now();
  let response;

  try {
    response = await axios.get(url, {
      timeout: FETCH_TIMEOUT_MS,
      maxContentLength: MAX_CONTENT_LENGTH,
      maxRedirects: 5,
      responseType: "text",
      // Some sites block requests with no User-Agent header entirely.
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PagePulseBot/1.0; +https://digitalheroesco.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      // Let us inspect non-2xx responses ourselves instead of throwing.
      validateStatus: () => true,
    });
  } catch (err) {
    throw translateNetworkError(err, url);
  }

  const responseTime = Date.now() - startedAt;
  const contentType = String(response.headers["content-type"] || "");

  if (response.status >= 400) {
    throw new AuditError(
      `The site responded with HTTP ${response.status}.`,
      502,
      "TARGET_ERROR_STATUS"
    );
  }

  if (!contentType.includes("text/html")) {
    throw new AuditError(
      `That URL returned "${contentType || "unknown"}" content, not an HTML page.`,
      422,
      "NON_HTML_RESPONSE"
    );
  }

  const parsed = parseHtml(response.data);

  return {
    status: response.status,
    responseTime,
    ...parsed,
  };
}

/**
 * Maps low-level axios/network errors to a user-friendly AuditError.
 */
function translateNetworkError(err, url) {
  if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
    return new AuditError(
      `The request to ${url} timed out after ${FETCH_TIMEOUT_MS}ms.`,
      504,
      "TIMEOUT"
    );
  }

  if (err.code === "ENOTFOUND" || err.code === "EAI_AGAIN") {
    return new AuditError(
      `Could not resolve the domain for ${url}. Check the URL and try again.`,
      502,
      "DNS_FAILURE"
    );
  }

  if (err.code === "ECONNREFUSED") {
    return new AuditError(
      `The server at ${url} refused the connection.`,
      502,
      "CONNECTION_REFUSED"
    );
  }

  if (err.code === "ERR_FR_TOO_MANY_REDIRECTS" || err.message?.includes("redirects")) {
    return new AuditError(
      `Too many redirects while fetching ${url}.`,
      502,
      "TOO_MANY_REDIRECTS"
    );
  }

  return new AuditError(
    `Failed to fetch ${url}: ${err.message}`,
    502,
    "FETCH_FAILED"
  );
}

module.exports = { auditUrl, AuditError };
