/**
 * urlValidator.js
 *
 * Small, dependency-free helpers for validating and normalizing the URL
 * a user submits for an audit. Kept separate from the service layer so it
 * can be unit tested in isolation and reused anywhere else it's needed.
 */

/**
 * Normalizes a raw user-supplied string into a URL we can safely fetch.
 * - Trims whitespace
 * - Adds an "https://" scheme when none is provided (e.g. "example.com")
 *
 * @param {string} rawUrl
 * @returns {string}
 */
function normalizeUrl(rawUrl) {
  const trimmed = (rawUrl || "").trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Validates that a string is a well-formed, fetchable http(s) URL.
 *
 * @param {string} rawUrl
 * @returns {{ valid: boolean, url?: string, reason?: string }}
 */
function validateUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string" || rawUrl.trim().length === 0) {
    return { valid: false, reason: "URL is required." };
  }

  const candidate = normalizeUrl(rawUrl);

  let parsed;
  try {
    parsed = new URL(candidate);
  } catch (err) {
    return { valid: false, reason: "That doesn't look like a valid URL." };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { valid: false, reason: "Only http and https URLs are supported." };
  }

  if (!parsed.hostname || !parsed.hostname.includes(".")) {
    // Guards against things like "https://localhost" being treated as a
    // public site, and catches obvious typos like "https://example".
    return { valid: false, reason: "URL must include a valid domain (e.g. example.com)." };
  }

  // Block requests aimed at internal/private infrastructure so the
  // audit tool can't be used as a proxy to probe internal networks.
  const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];
  const isPrivateIp = /^(10\.|172\.(1[6-9]|2\d|3[0-1])\.|192\.168\.)/.test(parsed.hostname);
  if (blockedHosts.includes(parsed.hostname) || isPrivateIp) {
    return { valid: false, reason: "URLs pointing to private or local addresses are not allowed." };
  }

  return { valid: true, url: parsed.toString() };
}

module.exports = { validateUrl, normalizeUrl };
