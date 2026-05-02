import { ExplanationBlock, CodeBlock, PageHeader } from '../components/UiElements';

export const IndexDoc = () => {
  return (
    <div>
      <PageHeader title="index.js" subtitle="The entry point — where everything boots up" />

      <div className="page-body">
        {/* Block 1 — Imports */}
        <div>
          <CodeBlock
            code={`import AgentAPI from 'apminsight'
AgentAPI.config();

import express from "express";
import http from "http";
import { matchesRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";
import { securityMiddleware } from "./arcjet.js";
import { commentaryRouter } from "./routes/commentary.js";`}
          />
          <ExplanationBlock title="Line-by-line: Imports">
            <ul>
              <li>
                <strong><code>import AgentAPI from 'apminsight'</code></strong> — pulls in an Application Performance Monitoring (APM) agent. It tracks response times, errors, and throughput across every request.
              </li>
              <li>
                <strong><code>AgentAPI.config()</code></strong> — initializes the agent <em>before</em> any other import so it can hook into every module loaded after it. Order matters here — if you import express first, APM won't instrument it.
              </li>
              <li>
                <strong><code>import express from "express"</code></strong> — loads the Express framework, which provides routing, middleware chaining, and request/response handling on top of raw Node HTTP.
              </li>
              <li>
                <strong><code>import http from "http"</code></strong> — Node's built-in HTTP module. We need this to create a raw server instance that can be shared between Express <em>and</em> WebSocket (they both bind to the same port).
              </li>
              <li>
                <strong><code>import {"{ matchesRouter }"}</code></strong> — brings in the router for <code>/matches</code> endpoints (GET list, POST create). Keeping routes in separate files keeps <code>index.js</code> clean.
              </li>
              <li>
                <strong><code>import {"{ attachWebSocketServer }"}</code></strong> — the function that bolts a WebSocket server onto our HTTP server for real-time push updates.
              </li>
              <li>
                <strong><code>import {"{ securityMiddleware }"}</code></strong> — Arcjet-powered middleware that rate-limits and bot-screens every incoming HTTP request.
              </li>
              <li>
                <strong><code>import {"{ commentaryRouter }"}</code></strong> — router for live commentary CRUD, mounted under <code>/matches/:id/commentary</code>.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> Every <code>import</code> at the top defines a dependency. If you remove one, a feature breaks. This file is the wiring diagram — it doesn't contain business logic, it just connects things together.</p>
          </ExplanationBlock>
        </div>

        {/* Block 2 — Server setup */}
        <div>
          <CodeBlock
            code={`const parsedPort = Number(process.env.PORT);
const PORT =
  Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535
    ? parsedPort
    : 8000;
const HOST = process.env.HOST || "0.0.0.0";
const app = express();

app.use(express.json());
const server = http.createServer(app);`}
          />
          <ExplanationBlock title="Line-by-line: Server Configuration">
            <ul>
              <li>
                <strong><code>Number(process.env.PORT)</code></strong> — reads the <code>PORT</code> environment variable and converts it to a number. Environment variables are always strings, so <code>Number()</code> is needed.
              </li>
              <li>
                <strong><code>Number.isInteger(parsedPort) && parsedPort &gt; 0 && parsedPort &lt;= 65535</code></strong> — validates the port is a real, usable port number. TCP ports only go up to 65535. If the env variable is missing or garbage, we fall back to <code>8000</code>.
              </li>
              <li>
                <strong><code>HOST = "0.0.0.0"</code></strong> — binds to all network interfaces. This means the server is accessible from outside the machine (important for Docker/deployment). <code>127.0.0.1</code> would restrict it to localhost only.
              </li>
              <li>
                <strong><code>const app = express()</code></strong> — creates the Express application instance. This is the object you attach routes and middleware to.
              </li>
              <li>
                <strong><code>app.use(express.json())</code></strong> — registers built-in middleware that parses incoming JSON request bodies. Without this, <code>req.body</code> would be <code>undefined</code> on POST/PUT requests.
              </li>
              <li>
                <strong><code>http.createServer(app)</code></strong> — wraps the Express app in a raw HTTP server. We do this instead of <code>app.listen()</code> because we need the raw <code>server</code> object to attach WebSocket to it later.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This block is pure infrastructure — it decides where the server runs, how it parses data, and creates the foundation that routes and WebSocket both plug into.</p>
          </ExplanationBlock>
        </div>

        {/* Block 3 — Routes & middleware */}
        <div>
          <CodeBlock
            code={`app.get("/", (req, res) => {
  res.send("Welcome to the Sports Dashboard!");
});

app.use(securityMiddleware());
app.use("/matches", matchesRouter);
app.use("/matches/:id/commentary", commentaryRouter);`}
          />
          <ExplanationBlock title="Line-by-line: Routes & Security">
            <ul>
              <li>
                <strong><code>app.get("/")</code></strong> — defines a GET route for the root URL. This is a health-check endpoint — if you hit <code>/</code> and get "Welcome", the server is alive.
              </li>
              <li>
                <strong><code>res.send("Welcome...")</code></strong> — sends a plain text response. No JSON, no template — just a quick confirmation string.
              </li>
              <li>
                <strong><code>app.use(securityMiddleware())</code></strong> — registers Arcjet as global middleware. <strong>Order matters:</strong> the root <code>/</code> route is defined <em>above</em> this line, so it's NOT protected. Every route defined <em>below</em> this line IS protected by rate limiting and bot detection.
              </li>
              <li>
                <strong><code>app.use("/matches", matchesRouter)</code></strong> — mounts the matches router. Any request to <code>/matches</code> or <code>/matches/...</code> gets forwarded to <code>matchesRouter</code>.
              </li>
              <li>
                <strong><code>app.use("/matches/:id/commentary", commentaryRouter)</code></strong> — mounts commentary as a nested route. The <code>:id</code> is a URL parameter — Express extracts it into <code>req.params.id</code> automatically.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> The order of <code>app.use()</code> calls defines the middleware pipeline. Security goes before business routes so every API call is screened. The root route is intentionally unprotected so monitoring tools can health-check without getting rate-limited.</p>
          </ExplanationBlock>
        </div>

        {/* Block 4 — WebSocket */}
        <div>
          <CodeBlock
            code={`const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;`}
          />
          <ExplanationBlock title="Line-by-line: WebSocket Integration">
            <ul>
              <li>
                <strong><code>attachWebSocketServer(server)</code></strong> — takes the raw HTTP server and bolts a WebSocket server onto it. Returns two broadcast functions. Both HTTP and WS now share the same port (8000).
              </li>
              <li>
                <strong><code>{"{ broadcastMatchCreated, broadcastCommentary }"}</code></strong> — destructuring. We extract two specific functions from the return value. These are "push buttons" — call them to push data to all connected WebSocket clients.
              </li>
              <li>
                <strong><code>app.locals.broadcastMatchCreated = ...</code></strong> — stores the function on <code>app.locals</code>, which is Express's built-in storage for app-wide variables. Now any route handler can access it via <code>req.app.locals.broadcastMatchCreated</code>.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This is the bridge between REST and WebSocket. When a POST route creates a new match in the database, it can immediately push that data to all live-connected clients. Without <code>app.locals</code>, the route files would need to import the WebSocket module directly — creating a circular dependency.</p>
          </ExplanationBlock>
        </div>

        {/* Block 5 — Listen */}
        <div>
          <CodeBlock
            code={`server.listen(PORT, HOST, () => {
  const baseURL =
    HOST === "0.0.0.0" ? \`http://localhost:\${PORT}\` : \`http://\${HOST}:\${PORT}\`;
  console.log(\`Server is running at \${baseURL}\`);
  console.log(\`WebSocket is running at \${baseURL.replace("http", "ws")}/ws\`);
});`}
          />
          <ExplanationBlock title="Line-by-line: Starting the Server">
            <ul>
              <li>
                <strong><code>server.listen(PORT, HOST, callback)</code></strong> — tells the OS to start accepting TCP connections on the specified port and host. The callback fires once the server is ready.
              </li>
              <li>
                <strong><code>HOST === "0.0.0.0" ? ... : ...</code></strong> — ternary for display purposes only. <code>0.0.0.0</code> isn't a real URL you can visit, so we swap it to <code>localhost</code> in the log message.
              </li>
              <li>
                <strong><code>baseURL.replace("http", "ws")</code></strong> — WebSocket protocol uses <code>ws://</code> instead of <code>http://</code>. This is just for the console log, not for any runtime logic.
              </li>
              <li>
                <strong><code>console.log(...)</code></strong> — prints the URLs so developers know where to point their browser or API client.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This is the final step. Nothing runs until <code>listen()</code> is called. The callback confirms the server is bound and ready. If the port is already in use, this is where it would throw an <code>EADDRINUSE</code> error.</p>
          </ExplanationBlock>
        </div>
      </div>
    </div>
  );
};
