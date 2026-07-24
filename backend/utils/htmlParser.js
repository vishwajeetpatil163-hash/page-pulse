/**
 * htmlParser.js
 *
 * Pure functions that take raw HTML and pull out the signals Page Pulse
 * reports on. Kept free of any network code so it can be unit tested with
 * plain HTML fixtures.
 */

const cheerio = require("cheerio");

/**
 * Parses an HTML string and extracts the audit-relevant fields.
 *
 * @param {string} html
 * @returns {{
 *   title: string,
 *   metaDescription: string,
 *   h1Count: number,
 *   imagesMissingAlt: number,
 *   wordCount: number
 * }}
 */
function parseHtml(html) {
  const $ = cheerio.load(html || "");

  const title = $("title").first().text().trim() || "Untitled page";

  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    "No meta description found";

  const h1Count = $("h1").length;

  let imagesMissingAlt = 0;
  $("img").each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt === undefined || alt.trim().length === 0) {
      imagesMissingAlt += 1;
    }
  });

  // Approximate word count from visible body text. Script/style content is
  // stripped first so it doesn't inflate the count.
  $("script, style, noscript").remove();
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.length === 0 ? 0 : bodyText.split(" ").length;

  return {
    title,
    metaDescription,
    h1Count,
    imagesMissingAlt,
    wordCount,
  };
}

module.exports = { parseHtml };
