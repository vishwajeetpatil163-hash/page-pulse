const request = require("supertest");

jest.mock("axios");
const axios = require("axios");

const { createApp } = require("../app");

const app = createApp();

function mockHtmlResponse(overrides = {}) {
  return {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
    data: `
      <html>
        <head>
          <title>Example Domain</title>
          <meta name="description" content="Example description" />
        </head>
        <body>
          <h1>Welcome</h1>
          <img src="a.png" alt="A" />
          <img src="b.png" />
          <p>Some sample text content for the audit tool to count.</p>
        </body>
      </html>
    `,
    ...overrides,
  };
}

describe("POST /api/audit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("happy path returns a full audit report", async () => {
    axios.get.mockResolvedValue(mockHtmlResponse());

    const res = await request(app)
      .post("/api/audit")
      .send({ url: "https://example.com" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 200,
      title: "Example Domain",
      metaDescription: "Example description",
      h1Count: 1,
      imagesMissingAlt: 1,
    });
    expect(typeof res.body.responseTime).toBe("number");
    expect(typeof res.body.wordCount).toBe("number");
  });

  test("rejects an invalid URL with 400 before hitting the network", async () => {
    const res = await request(app).post("/api/audit").send({ url: "" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_URL");
    expect(axios.get).not.toHaveBeenCalled();
  });

  test("returns 504 when the request times out", async () => {
    const timeoutError = new Error("timeout of 8000ms exceeded");
    timeoutError.code = "ECONNABORTED";
    axios.get.mockRejectedValue(timeoutError);

    const res = await request(app)
      .post("/api/audit")
      .send({ url: "https://slow-site.com" });

    expect(res.status).toBe(504);
    expect(res.body.error.code).toBe("TIMEOUT");
  });

  test("returns 502 on DNS failure", async () => {
    const dnsError = new Error("getaddrinfo ENOTFOUND");
    dnsError.code = "ENOTFOUND";
    axios.get.mockRejectedValue(dnsError);

    const res = await request(app)
      .post("/api/audit")
      .send({ url: "https://this-domain-does-not-exist-xyz.com" });

    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe("DNS_FAILURE");
  });

  test("returns 422 for a non-HTML response", async () => {
    axios.get.mockResolvedValue({
      status: 200,
      headers: { "content-type": "application/json" },
      data: '{"ok":true}',
    });

    const res = await request(app)
      .post("/api/audit")
      .send({ url: "https://api.example.com/data.json" });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("NON_HTML_RESPONSE");
  });

  test("returns 502 when the target site responds with an error status", async () => {
    axios.get.mockResolvedValue({
      status: 404,
      headers: { "content-type": "text/html" },
      data: "<html><body>Not found</body></html>",
    });

    const res = await request(app)
      .post("/api/audit")
      .send({ url: "https://example.com/missing-page" });

    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe("TARGET_ERROR_STATUS");
  });

  test("unknown routes return 404", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
  });
});
