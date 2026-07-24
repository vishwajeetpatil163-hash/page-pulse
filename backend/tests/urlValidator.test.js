const { validateUrl, normalizeUrl } = require("../utils/urlValidator");

describe("normalizeUrl", () => {
  test("adds https:// when no scheme is present", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
  });

  test("leaves an existing scheme untouched", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
  });
});

describe("validateUrl", () => {
  test("accepts a well-formed https URL", () => {
    const result = validateUrl("https://example.com");
    expect(result.valid).toBe(true);
    expect(result.url).toBe("https://example.com/");
  });

  test("accepts a bare domain and normalizes it", () => {
    const result = validateUrl("example.com");
    expect(result.valid).toBe(true);
    expect(result.url).toBe("https://example.com/");
  });

  test("rejects an empty string", () => {
    const result = validateUrl("");
    expect(result.valid).toBe(false);
  });

  test("rejects a malformed URL", () => {
    const result = validateUrl("ht!tp://not a url");
    expect(result.valid).toBe(false);
  });

  test("rejects unsupported protocols", () => {
    const result = validateUrl("ftp://example.com");
    expect(result.valid).toBe(false);
  });

  test("rejects localhost and private IP ranges", () => {
    expect(validateUrl("http://localhost").valid).toBe(false);
    expect(validateUrl("http://127.0.0.1").valid).toBe(false);
    expect(validateUrl("http://192.168.1.5").valid).toBe(false);
  });
});
