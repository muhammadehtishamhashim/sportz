import { ExplanationBlock, CodeBlock, PageHeader } from '../components/UiElements';

export const ArcjetDoc = () => {
  return (
    <div>
      <PageHeader title="arcjet.js" subtitle="Rate limiting, bot detection & security middleware" />

      <div className="page-body">
        {/* Block 1 — Configuration */}
        <div>
          <CodeBlock
            code={`import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

const arcjetMode = process.env.ARCJET_MODE === "LIVE" ? "LIVE" : "DRY_RUN";

const httpArcjet = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: arcjetMode }),
    detectBot({
      mode: arcjetMode,
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    slidingWindow({
      mode: arcjetMode,
      interval: "10s",
      max: 50,
    }),
  ],
});`}
          />
          <ExplanationBlock title="Line-by-line: Arcjet Setup">
            <ul>
              <li>
                <strong><code>import arcjet, {"{ shield, detectBot, slidingWindow }"}</code></strong> — <code>arcjet</code> is the main factory function. The named imports are rule builders — each one adds a layer of protection.
              </li>
              <li>
                <strong><code>arcjetMode</code></strong> — reads <code>ARCJET_MODE</code> from environment. <code>"LIVE"</code> actually blocks requests; <code>"DRY_RUN"</code> logs decisions without blocking. Use <code>DRY_RUN</code> in development so you don't lock yourself out.
              </li>
              <li>
                <strong><code>shield({"{ mode: arcjetMode }"})</code></strong> — detects and blocks common attack patterns: SQL injection attempts, XSS payloads, path traversal. It's a WAF (Web Application Firewall) rule.
              </li>
              <li>
                <strong><code>detectBot({"{ allow: [\"CATEGORY:SEARCH_ENGINE\"] }"})</code></strong> — blocks automated bots but whitelists search engine crawlers (Google, Bing). Without the whitelist, Google couldn't index your API docs or any public pages.
              </li>
              <li>
                <strong><code>slidingWindow({"{ interval: \"10s\", max: 50 }"})</code></strong> — rate limiter. Each client (by IP) can make at most 50 requests in any 10-second window. The "sliding" means it's not a fixed clock — it's a rolling 10-second period.
              </li>
              <li>
                <strong><code>key: process.env.ARCJET_KEY</code></strong> — API key that authenticates with Arcjet's cloud service. The decision engine runs partly in the cloud, partly locally.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> These three rules work in layers — shield catches exploits, bot detection catches scrapers, and rate limiting catches abuse. Together they protect against DDoS, scraping, and injection attacks without any manual IP blocking.</p>
          </ExplanationBlock>
        </div>

        {/* Block 2 — Middleware function */}
        <div>
          <CodeBlock
            code={`export function securityMiddleware() {
  return async (req, res, next) => {
    try {
      const decision = await httpArcjet.protect(req);
      if (decision.isDenied()) {
        return res.status(403).json({ error: "Access forbidden" });
      }
      next();
    } catch (err) {
      console.error("Arcjet error:", err);
      next(); // fail-open: don't block users if Arcjet itself fails
    }
  };
}`}
          />
          <ExplanationBlock title="Line-by-line: Middleware Pattern">
            <ul>
              <li>
                <strong><code>export function securityMiddleware()</code></strong> — a factory function that <em>returns</em> the actual middleware. This pattern allows passing config options in the future: <code>securityMiddleware({"{ strict: true }"})</code>.
              </li>
              <li>
                <strong><code>(req, res, next)</code></strong> — Express middleware signature. <code>req</code> is the request, <code>res</code> is the response, <code>next</code> is a function that passes control to the next middleware in the chain.
              </li>
              <li>
                <strong><code>httpArcjet.protect(req)</code></strong> — sends the request metadata (IP, headers, path) to Arcjet's decision engine. Returns a decision object.
              </li>
              <li>
                <strong><code>decision.isDenied()</code></strong> — returns <code>true</code> if any rule flagged this request. Could be a bot, rate-limit exceeded, or an attack pattern detected.
              </li>
              <li>
                <strong><code>res.status(403).json(...)</code></strong> — 403 Forbidden. The request is understood but refused. We <code>return</code> here to stop the middleware chain — <code>next()</code> is never called.
              </li>
              <li>
                <strong><code>next()</code> in catch</strong> — <strong>fail-open strategy</strong>. If Arcjet's service is down, we let the request through instead of blocking all users. This is a conscious trade-off: brief security gap vs. total outage.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> The fail-open approach (<code>next()</code> in the catch) is a critical design decision. The alternative — fail-closed — would mean an Arcjet outage blocks every single user. For most apps, availability is more important than perfect security.</p>
          </ExplanationBlock>
        </div>

        {/* Block 3 — WebSocket arcjet */}
        <div>
          <CodeBlock
            code={`export const wsArcjet = process.env.ARCJET_KEY
  ? arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        slidingWindow({ mode: arcjetMode, interval: "60s", max: 10 }),
      ],
    })
  : null;`}
          />
          <ExplanationBlock title="Line-by-line: WebSocket Protection">
            <ul>
              <li>
                <strong><code>process.env.ARCJET_KEY ? ... : null</code></strong> — conditional creation. If no API key is configured, <code>wsArcjet</code> is <code>null</code> and WebSocket connections run unprotected. This prevents crashes in development.
              </li>
              <li>
                <strong><code>interval: "60s", max: 10</code></strong> — much stricter rate limit than HTTP (50/10s). WebSocket connections are long-lived, so 10 new connections per minute per IP is plenty. More than that likely indicates abuse.
              </li>
              <li>
                <strong>Separate instance</strong> — WebSocket uses its own Arcjet instance (not the HTTP one) because the rules are different. HTTP needs high throughput; WebSocket needs connection limiting.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> Without this, an attacker could open thousands of WebSocket connections and exhaust your server's memory. Each WS connection holds state (subscribers, heartbeat timers), so they're more expensive than HTTP requests.</p>
          </ExplanationBlock>
        </div>
      </div>
    </div>
  );
};
