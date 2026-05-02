import { ExplanationBlock, CodeBlock } from '../components/UiElements';

export const IndexDoc = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] text-white p-8 text-center border-b border-slate-800">
        <h2 className="text-3xl font-extrabold mb-2 text-cyan-400">index.js</h2>
        <p className="text-slate-400">The "Brain" of your Application</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        
        {/* Block 1 */}
        <div>
          <CodeBlock 
            code={`import AgentAPI from 'apminsight'
AgentAPI.config();

import express from "express";
import http from "http";
import { matchesRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";`} 
          />
          <ExplanationBlock title="Step 1: Bringing in the Tools">
            In simple words: <strong>We are gathering our tools!</strong> 
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><code>apminsight</code> is like a "Health Monitor" that watches if our app is sick or slow.</li>
              <li><code>express</code> is the "Host" that welcomes users to our website.</li>
              <li><code>http</code> is the "Communication System" that lets data travel over the internet.</li>
              <li>The other imports bring in specific parts of our app, like the <strong>Matches</strong> list and the <strong>Live Updates</strong> system.</li>
            </ul>
          </ExplanationBlock>
        </div>

        {/* Block 2 */}
        <div>
          <CodeBlock 
            code={`const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
const server = http.createServer(app);`} 
          />
          <ExplanationBlock title="Step 2: Building the House">
            In simple words: <strong>We are setting up the foundation!</strong>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><code>PORT</code> is like a "Door Number". We use door 8000 so users know where to find us.</li>
              <li><code>express.json()</code> is like a "Language Translator". It makes sure our app understands data sent in JSON format.</li>
              <li><code>http.createServer</code> is the actual "Building" that houses everything.</li>
            </ul>
          </ExplanationBlock>
        </div>

        {/* Block 3 */}
        <div>
          <CodeBlock 
            code={`app.get("/", (req, res) => {
  res.send("Welcome to the Sports Dashboard!");
});

app.use(securityMiddleware());
app.use("/matches", matchesRouter);`} 
          />
          <ExplanationBlock title="Step 3: Setting the Rules">
            In simple words: <strong>We are telling the app what to do!</strong>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>The first part says: "When someone visits our home page, say Hello!".</li>
              <li><code>securityMiddleware</code> is our "Security Guard". He checks everyone at the door to make sure they aren't bad bots.</li>
              <li><code>/matches</code> tells the app: "If someone asks for matches, use the Match Logic we built earlier."</li>
            </ul>
          </ExplanationBlock>
        </div>

        {/* Block 4 */}
        <div>
          <CodeBlock 
            code={`const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;`} 
          />
          <ExplanationBlock title="Step 4: Connecting the Live Feed">
            In simple words: <strong>We are plugging in the Live TV!</strong>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>We attach our "Live Update System" (WebSocket) to the main building.</li>
              <li>We save these "Broadcast" buttons so that later, when a goal is scored, we can just press the button to tell everyone instantly.</li>
            </ul>
          </ExplanationBlock>
        </div>

        {/* Block 5 */}
        <div>
          <CodeBlock 
            code={`server.listen(PORT, () => {
  console.log(\`Server is running at http://localhost:\${PORT}\`);
});`} 
          />
          <ExplanationBlock title="Step 5: Opening the Doors">
            In simple words: <strong>We are officially Open for Business!</strong>
            <p className="mt-2">The app is now "listening" for people to visit. It's like turning on the lights and opening the front gate.</p>
          </ExplanationBlock>
        </div>

      </div>
    </div>
  );
};
