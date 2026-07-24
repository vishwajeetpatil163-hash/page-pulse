const { parseHtml } = require("../utils/htmlParser");

describe("parseHtml", () => {
  test("extracts title, meta description, h1 count, missing alts and word count", () => {
    const html = `
      <html>
        <head>
          <title>Example Domain</title>
          <meta name="description" content="Example description" />
        </head>
        <body>
          <h1>Welcome</h1>
          <h1>Second heading</h1>
          <img src="a.png" alt="A" />
          <img src="b.png" />
          <img src="c.png" alt="" />
          <p>This is some sample body text with seven words.</p>
        </body>
      </html>
    `;

    const result = parseHtml(html);

    expect(result.title).toBe("Example Domain");
    expect(result.metaDescription).toBe("Example description");
    expect(result.h1Count).toBe(2);
    expect(result.imagesMissingAlt).toBe(2); // missing attr + empty alt
    expect(result.wordCount).toBeGreaterThan(0);
  });

  test("falls back gracefully when title and meta description are missing", () => {
    const html = "<html><body><p>No head tags here.</p></body></html>";

    const result = parseHtml(html);

    expect(result.title).toBe("Untitled page");
    expect(result.metaDescription).toBe("No meta description found");
    expect(result.h1Count).toBe(0);
    expect(result.imagesMissingAlt).toBe(0);
  });

  test("uses og:description when a standard meta description is absent", () => {
    const html = `
      <html><head>
        <meta property="og:description" content="OG fallback description" />
      </head><body></body></html>
    `;

    const result = parseHtml(html);
    expect(result.metaDescription).toBe("OG fallback description");
  });

  test("returns 0 word count for empty body", () => {
    const html = "<html><head><title>Empty</title></head><body></body></html>";
    const result = parseHtml(html);
    expect(result.wordCount).toBe(0);
  });

  test("does not count script or style content as words", () => {
    const html = `
      <html><body>
        <script>var x = "this should not be counted as words at all";</script>
        <style>.a { color: red; padding: 10px; }</style>
        <p>Three real words</p>
      </body></html>
    `;
    const result = parseHtml(html);
    expect(result.wordCount).toBe(3);
  });
});
