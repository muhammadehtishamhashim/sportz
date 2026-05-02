import { ExplanationBlock, CodeBlock, PageHeader } from '../components/UiElements';

export const RoutesMatchesDoc = () => {
  return (
    <div>
      <PageHeader title="routes/matches.js" subtitle="CRUD endpoints for match management" />

      <div className="page-body">
        {/* Block 1 — GET all matches */}
        <div>
          <CodeBlock
            code={`import { Router } from "express";
import { db } from "../db/db.js";
import { matches } from "../db/schema.js";

export const matchesRouter = Router();

matchesRouter.get("/", async (req, res) => {
  try {
    const data = await db.select().from(matches);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});`}
          />
          <ExplanationBlock title="Line-by-line: GET /matches">
            <ul>
              <li>
                <strong><code>Router()</code></strong> — creates an isolated group of routes. Think of it as a mini-app that can be mounted on any path. This keeps route logic out of <code>index.js</code>.
              </li>
              <li>
                <strong><code>matchesRouter.get("/")</code></strong> — defines a GET handler. Since this router is mounted at <code>/matches</code> in index.js, this handles <code>GET /matches</code>.
              </li>
              <li>
                <strong><code>async (req, res)</code></strong> — the handler is <code>async</code> because database queries return Promises. Without <code>async</code>, we'd need <code>.then().catch()</code> chains.
              </li>
              <li>
                <strong><code>db.select().from(matches)</code></strong> — Drizzle's query builder. Generates <code>SELECT * FROM matches</code>. Returns an array of row objects with TypeScript types matching the schema.
              </li>
              <li>
                <strong><code>res.json({"{ data }"})</code></strong> — sends the response as JSON with a <code>Content-Type: application/json</code> header. Wrapping in <code>{"{ data }"}</code> gives a consistent response shape.
              </li>
              <li>
                <strong><code>catch (err)</code></strong> — if the database is down or the query fails, we return a 500 instead of crashing the server. Never let unhandled errors kill your process.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This is the simplest REST pattern: receive request → query database → return JSON. The <code>try/catch</code> ensures the server stays alive even when the database is unreachable.</p>
          </ExplanationBlock>
        </div>

        {/* Block 2 — POST create match */}
        <div>
          <CodeBlock
            code={`matchesRouter.post("/", async (req, res) => {
  try {
    const validated = createMatchSchema.parse(req.body);
    const [newMatch] = await db.insert(matches).values(validated).returning();

    if (req.app.locals.broadcastMatchCreated) {
      req.app.locals.broadcastMatchCreated(newMatch);
    }

    res.status(201).json({ data: newMatch });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ error: "Failed to create match" });
  }
});`}
          />
          <ExplanationBlock title="Line-by-line: POST /matches">
            <ul>
              <li>
                <strong><code>createMatchSchema.parse(req.body)</code></strong> — validates the incoming JSON body against the Zod schema. If validation fails, Zod throws a <code>ZodError</code> with details about which fields are wrong.
              </li>
              <li>
                <strong><code>.parse()</code> vs <code>.safeParse()</code></strong> — <code>parse()</code> throws on invalid data, <code>safeParse()</code> returns a result object. We use <code>parse()</code> here and catch the error below.
              </li>
              <li>
                <strong><code>db.insert(matches).values(validated)</code></strong> — inserts a new row. We pass the <code>validated</code> object (not raw <code>req.body</code>) to ensure only schema-compliant data hits the database.
              </li>
              <li>
                <strong><code>.returning()</code></strong> — PostgreSQL-specific. Tells the database to return the inserted row(s), including auto-generated fields like <code>id</code> and <code>created_at</code>. Without it, you'd need a separate SELECT query.
              </li>
              <li>
                <strong><code>const [newMatch]</code></strong> — destructures the first element. <code>.returning()</code> returns an array (even for single inserts), so we grab index 0.
              </li>
              <li>
                <strong><code>req.app.locals.broadcastMatchCreated(newMatch)</code></strong> — calls the WebSocket broadcast function stored on <code>app.locals</code>. This pushes the new match to all connected WebSocket clients in real-time.
              </li>
              <li>
                <strong><code>res.status(201)</code></strong> — HTTP 201 means "Created". This is the correct status code for successful POST requests that create a resource. 200 would work but 201 is semantically accurate.
              </li>
              <li>
                <strong><code>err.name === "ZodError"</code></strong> — distinguishes validation errors (user's fault, 400) from server errors (our fault, 500). Returning the Zod <code>err.errors</code> array tells the client exactly which fields failed.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This endpoint does three things atomically: validate → store → broadcast. The validation-first approach means garbage data never touches the database. The broadcast makes the app feel "live" — create a match via API and everyone sees it instantly.</p>
          </ExplanationBlock>
        </div>
      </div>
    </div>
  );
};
