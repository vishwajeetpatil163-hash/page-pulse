# Page Pulse — Website Audit Tool

Page Pulse takes any URL and reports back on its vital signs: HTTP status,
response time, page title, meta description, heading structure, image
accessibility, and approximate word count — all in a few seconds.

Built as an SDE internship training task for **Digital Heroes**.

---

## Table of contents

1. [Project overview](#project-overview)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Folder structure](#folder-structure)
5. [Installation](#installation)
6. [Running locally](#running-locally)
7. [Environment variables](#environment-variables)
8. [API documentation](#api-documentation)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Screenshots](#screenshots)
12. [Design decisions](#design-decisions)
13. [Future improvements](#future-improvements)

---

## Project overview

You give Page Pulse a URL. It fetches the page server-side, times the
request, parses the returned HTML, and hands back a structured JSON report.
The frontend turns that report into a small dashboard of "vitals" cards, each
color-coded by whether the value looks healthy, borderline, or concerning.

The project is split into two independently deployable apps:

- **`backend/`** — an Express REST API that does the fetching and parsing.
- **`frontend/`** — a React (Vite) single-page app that calls the API and
  renders the results.

## Features

- Audits any public URL for HTTP status, response time, title, meta
  description, H1 count, images missing `alt` text, and word count
- Defensive error handling: invalid URLs, timeouts, DNS failures, 4xx/5xx
  responses, non-HTML responses, and excessive redirects all return clear,
  structured errors instead of crashing the server
- Dark mode toggle (persisted)
- Copy report as JSON / download report as a `.json` file
- Recent searches, persisted in `localStorage`, one click to re-run
- Loading skeleton + animated result cards
- Fully responsive, keyboard-accessible UI
- Unit + integration test suite (Jest + Supertest) covering the happy path,
  invalid input, timeouts, non-HTML responses, and the HTML parser itself

## Tech stack

**Frontend:** React 18 (Vite), Tailwind CSS, lucide-react icons
**Backend:** Node.js, Express
**Libraries:** axios, cheerio, cors, dotenv
**Testing:** Jest, Supertest

## Folder structure

```
pagepulse/
├── backend/
│   ├── controllers/       # Request handlers (thin — delegate to services)
│   │   └── auditController.js
│   ├── services/           # Business logic: fetching + orchestration
│   │   └── auditService.js
│   ├── routes/              # Express route definitions
│   │   └── auditRoutes.js
│   ├── middleware/         # Validation + centralized error handling
│   │   ├── validateAuditRequest.js
│   │   └── errorHandler.js
│   ├── utils/               # Pure, unit-testable helpers
│   │   ├── urlValidator.js
│   │   └── htmlParser.js
│   ├── tests/               # Jest + Supertest test suites
│   │   ├── audit.test.js
│   │   ├── htmlParser.test.js
│   │   └── urlValidator.test.js
│   ├── app.js                # Express app assembly (no listen())
│   ├── server.js             # Entry point — loads env, starts listening
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Presentational building blocks
│   │   ├── pages/            # HomePage composes the whole screen
│   │   ├── hooks/            # useDarkMode, useRecentSearches
│   │   ├── services/         # auditApi.js (fetch client), reportMetrics.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json
│   ├── .env.example
│   └── .gitignore
│
├── render.yaml              # Render blueprint for the backend
└── README.md
```

## Installation

Requires **Node.js 18+** and **npm**.

```bash
git clone https://github.com/<your-username>/page-pulse.git
cd page-pulse

# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

## Running locally

Open two terminals.

**Terminal 1 — backend:**

```bash
cd backend
npm run dev
# → Page Pulse API listening on port 5000
```

**Terminal 2 — frontend:**

```bash
cd frontend
npm run dev
# → Local: http://localhost:5173
```

Visit `http://localhost:5173`, enter a URL (e.g. `example.com`), and click
**Run audit**.

## Environment variables

### `backend/.env`

| Variable             | Description                                              | Default |
|-----------------------|-----------------------------------------------------------|---------|
| `PORT`                | Port the Express server listens on                        | `5000`  |
| `CORS_ORIGIN`         | Comma-separated list of allowed frontend origins           | `http://localhost:5173` |
| `FETCH_TIMEOUT_MS`    | Timeout for the outbound fetch to the target site (ms)     | `8000`  |
| `MAX_CONTENT_LENGTH`  | Max response body size accepted from the target site (bytes) | `5000000` |

### `frontend/.env`

| Variable               | Description                          | Default |
|-------------------------|----------------------------------------|---------|
| `VITE_API_BASE_URL`    | Base URL of the backend API            | `http://localhost:5000` |

## API documentation

### `POST /api/audit`

Audits a single URL.

**Request body**

```json
{ "url": "https://example.com" }
```

`url` may omit the scheme (`example.com` is normalized to `https://example.com`).

**Success — `200 OK`**

```json
{
  "status": 200,
  "responseTime": 245,
  "title": "Example Domain",
  "metaDescription": "Example description",
  "h1Count": 2,
  "imagesMissingAlt": 5,
  "wordCount": 1543
}
```

**Error responses**

All errors share the same shape:

```json
{ "error": { "code": "TIMEOUT", "message": "The request to https://slow-site.com timed out after 8000ms." } }
```

| Status | Code                  | Cause                                             |
|--------|------------------------|----------------------------------------------------|
| 400    | `INVALID_URL`         | Missing, malformed, or private/local URL           |
| 422    | `NON_HTML_RESPONSE`   | Target responded with a non-HTML content type       |
| 502    | `TARGET_ERROR_STATUS` | Target responded with a 4xx/5xx status              |
| 502    | `DNS_FAILURE`         | Domain could not be resolved                        |
| 502    | `CONNECTION_REFUSED`  | Target server refused the connection                |
| 502    | `TOO_MANY_REDIRECTS`  | Exceeded the redirect limit                         |
| 504    | `TIMEOUT`             | Target did not respond within `FETCH_TIMEOUT_MS`    |
| 500    | `INTERNAL_ERROR`      | Unexpected server error                             |

### `GET /health`

Returns `{ "status": "ok", "service": "pagepulse-api" }`. Useful for uptime
checks and confirming a deploy succeeded.

## Testing

```bash
cd backend
npm test
```

Covers:

- **Happy path** — a full, well-formed HTML page audits successfully
- **Invalid URL** — empty/malformed input is rejected with `400` before any
  network call is made
- **Timeout** — a request that exceeds `FETCH_TIMEOUT_MS` returns `504`
- **Non-HTML response** — a JSON/binary response returns `422`
- **Target error status** — a 404/500 from the target returns `502`
- **Parser logic** — title, meta description, H1 count, missing-alt count,
  and word count extraction, including edge cases (missing tags, empty body,
  script/style content excluded from word count)

## Deployment

### Frontend → Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New Project** → import the repo.
3. Set the **root directory** to `frontend`.
4. Vercel auto-detects Vite (`vercel.json` is already included, so no build
   settings need to be changed manually).
5. Add an environment variable: `VITE_API_BASE_URL` = your Render backend URL
   (e.g. `https://pagepulse-backend.onrender.com`).
6. Deploy.

### Backend → Render

1. In Render, **New** → **Web Service** → connect the same repo.
2. Render will pick up `render.yaml` at the repo root automatically (or set
   the **root directory** to `backend` manually if creating the service by
   hand).
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables from `backend/.env.example`, setting
   `CORS_ORIGIN` to your deployed Vercel URL.
5. Deploy. Confirm `GET /health` returns `200`.

No code changes are required for either deployment — both apps read their
configuration entirely from environment variables.

## Screenshots

> Add screenshots after your first local run:

- `docs/screenshot-light.png` — light mode, populated report
- `docs/screenshot-dark.png` — dark mode, populated report
- `docs/screenshot-error.png` — error state

## Design decisions

**1. Separating `app.js` from `server.js`.**
`app.js` builds and exports the Express app; `server.js` is the only file
that calls `.listen()`. This lets Supertest import the app directly in tests
without binding a real port, so the test suite runs fast and in parallel-safe
isolation.

**2. A dedicated, pure HTML parser module.**
`utils/htmlParser.js` has no knowledge of HTTP, axios, or error handling —
it's a pure function from HTML string to extracted fields. That made it
possible to unit test parsing logic (missing tags, empty bodies, script/style
exclusion) with plain string fixtures, independent of network mocking, which
keeps the fast unit tests fast and the network-dependent integration tests
focused on orchestration and error mapping instead.

**3. Mapping every failure mode to a typed `AuditError` with a stable `code`.**
Rather than letting axios errors leak to the client, `auditService.js`
translates every failure (timeout, DNS, refused connection, bad status,
non-HTML) into an `AuditError` carrying an HTTP status and a machine-readable
`code`. The frontend and any future client can branch on `error.code` instead
of parsing message strings, and the centralized `errorHandler` middleware
guarantees the process never crashes on a bad request — every path resolves
to a JSON response.

## Future improvements

- Cache recent audits (e.g. Redis) to avoid re-fetching the same URL
  repeatedly within a short window
- Add Lighthouse-style performance scoring instead of a single response-time
  number
- Support auditing multiple URLs in one batch request
- Add authentication + per-user saved audit history (currently only
  device-local via `localStorage`)
- Broken-link checker for internal links found on the page
