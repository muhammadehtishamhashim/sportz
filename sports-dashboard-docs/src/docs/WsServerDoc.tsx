import { ExplanationBlock, CodeBlock, PageHeader } from '../components/UiElements';

export const WsServerDoc = () => {
  return (
    <div>
      <PageHeader title="ws/server.js" subtitle="Real-time push updates via WebSocket" />

      <div className="page-body">
        {/* Block 1 — Imports & sendJson */}
        <div>
          <CodeBlock
            code={`import { WebSocket, WebSocketServer } from "ws";
import { wsArcjet } from "../arcjet.js";

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}`}
          />
          <ExplanationBlock title="Line-by-line: Setup & Utility">
            <ul>
              <li>
                <strong><code>import {"{ WebSocket, WebSocketServer }"} from "ws"</code></strong> — <code>ws</code> is the de-facto WebSocket library for Node. <code>WebSocketServer</code> creates the server, <code>WebSocket</code> provides constants like <code>.OPEN</code>, <code>.CLOSED</code>, etc.
              </li>
              <li>
                <strong><code>import {"{ wsArcjet }"}</code></strong> — a separate Arcjet instance configured specifically for WebSocket connections (different rate-limit rules than HTTP).
              </li>
              <li>
                <strong><code>function sendJson(socket, payload)</code></strong> — a helper that safely sends JSON to a single client.
              </li>
              <li>
                <strong><code>socket.readyState !== WebSocket.OPEN</code></strong> — guard clause. A socket can be in states: CONNECTING, OPEN, CLOSING, CLOSED. We only send data when it's <code>OPEN</code>. Sending to a closing socket throws an error.
              </li>
              <li>
                <strong><code>JSON.stringify(payload)</code></strong> — WebSocket only transmits strings or binary. We convert our JavaScript object to a JSON string so the client can parse it back with <code>JSON.parse()</code>.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> Every WebSocket message in this app goes through <code>sendJson</code>. The readyState check prevents crashes when clients disconnect mid-transmission. Without it, the server would throw unhandled errors on every dropped connection.</p>
          </ExplanationBlock>
        </div>

        {/* Block 2 — Subscription system */}
        <div>
          <CodeBlock
            code={`const matchSubscribers = new Map();

function subscribe(matchId, socket) {
  if (!matchSubscribers.has(matchId)) {
    matchSubscribers.set(matchId, new Set());
  }
  matchSubscribers.get(matchId).add(socket);
}

function unsubscribe(matchId, socket) {
  const subs = matchSubscribers.get(matchId);
  if (subs) {
    subs.delete(socket);
    if (subs.size === 0) matchSubscribers.delete(matchId);
  }
}`}
          />
          <ExplanationBlock title="Line-by-line: Pub/Sub Pattern">
            <ul>
              <li>
                <strong><code>const matchSubscribers = new Map()</code></strong> — a <code>Map</code> where each key is a <code>matchId</code> and each value is a <code>Set</code> of sockets watching that match. Using <code>Map</code> over a plain object gives us <code>.has()</code>, <code>.delete()</code>, and better performance for frequent add/remove operations.
              </li>
              <li>
                <strong><code>new Set()</code></strong> — a <code>Set</code> guarantees uniqueness. If the same socket tries to subscribe twice, it won't be duplicated. This prevents sending the same update to a client multiple times.
              </li>
              <li>
                <strong><code>subscribe(matchId, socket)</code></strong> — adds a socket to the subscriber list for a specific match. If no list exists yet, it creates one.
              </li>
              <li>
                <strong><code>unsubscribe(matchId, socket)</code></strong> — removes a socket. If that was the last subscriber, we delete the entire match entry to prevent memory leaks from empty Sets accumulating.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This is a publish/subscribe (pub/sub) system. Without it, every broadcast would go to every client, wasting bandwidth. With it, a client watching Match #5 only receives Match #5 updates. This scales much better.</p>
          </ExplanationBlock>
        </div>

        {/* Block 3 — Upgrade event (security) */}
        <div>
          <CodeBlock
            code={`server.on("upgrade", async (req, socket, head) => {
  if (wsArcjet) {
    const decision = await wsArcjet.protect(req);
    if (decision.isDenied()) {
      socket.write("HTTP/1.1 403 Forbidden\\r\\n\\r\\n");
      socket.destroy();
      return;
    }
  }
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});`}
          />
          <ExplanationBlock title="Line-by-line: Connection Security">
            <ul>
              <li>
                <strong><code>server.on("upgrade")</code></strong> — WebSocket connections start as a normal HTTP request with an <code>Upgrade: websocket</code> header. The <code>"upgrade"</code> event fires <em>before</em> the handshake completes, giving us a chance to reject bad actors.
              </li>
              <li>
                <strong><code>req, socket, head</code></strong> — three arguments: the HTTP request object, the raw TCP socket, and any buffered data (the "head"). We use <code>req</code> to check the client's IP/headers.
              </li>
              <li>
                <strong><code>wsArcjet.protect(req)</code></strong> — runs the same bot-detection and rate-limiting rules against WebSocket connections. Returns a decision object.
              </li>
              <li>
                <strong><code>decision.isDenied()</code></strong> — if Arcjet rejects this client (too many connections, detected as a bot), we block them.
              </li>
              <li>
                <strong><code>socket.write("HTTP/1.1 403...")</code></strong> — sends a raw HTTP 403 response. At this stage, the WebSocket handshake hasn't completed, so we write raw HTTP directly to the TCP socket.
              </li>
              <li>
                <strong><code>socket.destroy()</code></strong> — forcefully closes the TCP connection. The client never gets a WebSocket connection at all.
              </li>
              <li>
                <strong><code>wss.handleUpgrade(...)</code></strong> — if the client passes security, we let the <code>ws</code> library complete the WebSocket handshake and emit a <code>"connection"</code> event.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> By validating at the <code>upgrade</code> event (before the handshake), we reject bad clients at the TCP level. They never consume WebSocket resources. This is far more efficient than letting them connect and then kicking them.</p>
          </ExplanationBlock>
        </div>

        {/* Block 4 — Connection handler */}
        <div>
          <CodeBlock
            code={`wss.on("connection", (socket, req) => {
  socket.isAlive = true;
  socket.on("pong", () => { socket.isAlive = true; });

  sendJson(socket, { type: "welcome" });

  socket.on("message", (data) => { handleMessage(socket, data); });

  socket.on("close", () => { cleanupSocket(socket); });
});`}
          />
          <ExplanationBlock title="Line-by-line: Handling Connections">
            <ul>
              <li>
                <strong><code>wss.on("connection")</code></strong> — fires once per new WebSocket client that passes the upgrade check. <code>socket</code> is the individual client connection.
              </li>
              <li>
                <strong><code>socket.isAlive = true</code></strong> — a custom property we attach to track if the client is still responsive. This is used by the heartbeat system (ping/pong).
              </li>
              <li>
                <strong><code>socket.on("pong")</code></strong> — the client automatically replies <code>pong</code> when we send a <code>ping</code>. When we receive it, we mark the client as alive. If a client never responds, the heartbeat timer will close their connection.
              </li>
              <li>
                <strong><code>sendJson(socket, {"{ type: \"welcome\" }"})</code></strong> — immediately sends a welcome message to confirm the connection is working. The client can use this to know the handshake succeeded.
              </li>
              <li>
                <strong><code>socket.on("message")</code></strong> — listens for incoming messages from the client (like "subscribe to match #5"). Delegates to <code>handleMessage</code> which parses the JSON and routes it.
              </li>
              <li>
                <strong><code>socket.on("close")</code></strong> — fires when the client disconnects (tab closed, network lost). We run <code>cleanupSocket</code> to remove them from all subscriber lists and prevent memory leaks.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This is the lifecycle of a WebSocket connection: connect → welcome → listen for messages → cleanup on close. The heartbeat (<code>ping/pong</code>) catches "zombie" connections where the client crashed without sending a proper close frame.</p>
          </ExplanationBlock>
        </div>

        {/* Block 5 — Broadcasting */}
        <div>
          <CodeBlock
            code={`function broadcastToMatch(matchId, payload) {
  const subs = matchSubscribers.get(matchId);
  if (!subs) return;
  for (const socket of subs) {
    sendJson(socket, payload);
  }
}

function broadcastMatchCreated(match) {
  // Notify ALL connected clients about a new match
  for (const client of wss.clients) {
    sendJson(client, { type: "match_created", data: match });
  }
}

function broadcastCommentary(matchId, comment) {
  broadcastToMatch(matchId, { type: "commentary", data: comment });
}`}
          />
          <ExplanationBlock title="Line-by-line: Broadcasting">
            <ul>
              <li>
                <strong><code>broadcastToMatch(matchId, payload)</code></strong> — looks up the subscriber Set for a given match and sends the payload to each socket. If nobody is watching that match, we skip immediately (<code>if (!subs) return</code>).
              </li>
              <li>
                <strong><code>for (const socket of subs)</code></strong> — iterates over the <code>Set</code>. Each socket gets the same message. <code>sendJson</code> handles the readyState check per-socket.
              </li>
              <li>
                <strong><code>broadcastMatchCreated(match)</code></strong> — a special broadcast that goes to <em>all</em> clients (<code>wss.clients</code>), not just match subscribers. Everyone needs to know about new matches regardless of what they're watching.
              </li>
              <li>
                <strong><code>broadcastCommentary(matchId, comment)</code></strong> — sends commentary only to subscribers of that specific match. This is the targeted broadcast.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> There are two broadcast strategies here — global (new match) and targeted (commentary). This is the core value of WebSocket: the server pushes data to clients the instant something changes, without the client needing to poll.</p>
          </ExplanationBlock>
        </div>
      </div>
    </div>
  );
};
