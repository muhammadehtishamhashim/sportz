import { ExplanationBlock, CodeBlock } from '../components/UiElements';

export const WsServerDoc = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] text-white p-8 text-center border-b border-slate-800">
        <h2 className="text-3xl font-extrabold mb-2 text-cyan-400">ws/server.js</h2>
        <p className="text-slate-400">The "Live Update" Delivery System</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        
        {/* Block 1 */}
        <div>
          <CodeBlock 
            code={`import { WebSocket, WebSocketServer } from "ws";
import { wsArcjet } from "../arcjet.js";

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}`} 
          />
          <ExplanationBlock title="Basics: Sending Messages">
            In simple words: <strong>How we talk to users!</strong>
            <p className="mt-2">Standard websites require you to "refresh" the page to see new info. WebSockets are different—they keep a "phone line" open. This <code>sendJson</code> function is like sending a text message over that line.</p>
          </ExplanationBlock>
        </div>

        {/* Block 2 */}
        <div>
          <CodeBlock 
            code={`const matchSubscribers = new Map();

function subscribe(matchId, socket) {
  if (!matchSubscribers.has(matchId)) {
    matchSubscribers.set(matchId, new Set());
  }
  matchSubscribers.get(matchId).add(socket);
}`} 
          />
          <ExplanationBlock title="The 'Mailing List' System">
            In simple words: <strong>Who is watching what?</strong>
            <p className="mt-2">We don't want to send "Cricket" updates to someone who is only watching "Football". This code creates a list for every match. When you click a match, we add you to that match's "Mailing List" so you only get the updates you care about.</p>
          </ExplanationBlock>
        </div>

        {/* Block 3 */}
        <div>
          <CodeBlock 
            code={`server.on("upgrade", async (req, socket, head) => {
  if (wsArcjet) {
    const decision = await wsArcjet.protect(req);
    if (decision.isDenied()) {
      socket.destroy();
      return;
    }
  }
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});`} 
          />
          <ExplanationBlock title="The Security Checkpoint">
            In simple words: <strong>Checking IDs!</strong>
            <p className="mt-2">Before we let someone into our "Live Feed", we check with <strong>Arcjet</strong>. It's like a bouncer at a club. If the bouncer says "No" (maybe because you're a bot), we hang up the phone (<code>socket.destroy()</code>) immediately.</p>
          </ExplanationBlock>
        </div>

        {/* Block 4 */}
        <div>
          <CodeBlock 
            code={`wss.on("connection", (socket, req) => {
  socket.isAlive = true;
  socket.on("pong", () => { socket.isAlive = true; });

  sendJson(socket, { type: "welcome" });

  socket.on("message", (data) => { handleMessage(socket, data); });
});`} 
          />
          <ExplanationBlock title="Welcoming New Guests">
            In simple words: <strong>The Handshake!</strong>
            <p className="mt-2">When someone joins, we say "Welcome!". We also start a "Heartbeat". Every few seconds, we ask "Are you still there?". If they don't answer (the <code>pong</code>), we know they left and we can clean up their data.</p>
          </ExplanationBlock>
        </div>

        {/* Block 5 */}
        <div>
          <CodeBlock 
            code={`function broadcastCommentary(matchId, comment) {
  broadcastToMatch(matchId, { type: "commentary", data: comment });
}`} 
          />
          <ExplanationBlock title="The Goal Shoutout!">
            In simple words: <strong>Shouting the news!</strong>
            <p className="mt-2">When a new comment is added to a match, we find everyone on that match's "Mailing List" and shout the news to them. This is how the score updates on your screen without you doing anything!</p>
          </ExplanationBlock>
        </div>

      </div>
    </div>
  );
};
