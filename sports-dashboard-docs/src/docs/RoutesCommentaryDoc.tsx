import { ExplanationBlock, CodeBlock, PageHeader } from '../components/UiElements';

export const RoutesCommentaryDoc = () => {
  return (
    <div>
      <PageHeader title="routes/commentary.js" subtitle="Live commentary CRUD for individual matches" />

      <div className="page-body">
        {/* Block 1 — GET commentary */}
        <div>
          <CodeBlock
            code={`import { Router } from "express";
import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

export const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.get("/", async (req, res) => {
  try {
    const { id } = matchIdParamSchema.parse(req.params);
    const { limit } = listCommentaryQuerySchema.parse(req.query);

    const data = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, id))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch commentary" });
  }
});`}
          />
          <ExplanationBlock title="Line-by-line: GET /matches/:id/commentary">
            <ul>
              <li>
                <strong><code>Router({"{ mergeParams: true }"})</code></strong> — critical option. This router is mounted at <code>/matches/:id/commentary</code>, but by default, child routers can't see parent route params. <code>mergeParams: true</code> makes <code>req.params.id</code> (from <code>:id</code>) accessible here.
              </li>
              <li>
                <strong><code>matchIdParamSchema.parse(req.params)</code></strong> — validates <code>req.params</code> using Zod. Ensures <code>id</code> is a valid integer. URL params are always strings, so the schema coerces <code>"5"</code> to <code>5</code>.
              </li>
              <li>
                <strong><code>listCommentaryQuerySchema.parse(req.query)</code></strong> — validates query parameters like <code>?limit=20</code>. Provides a default limit if none is given. Prevents clients from requesting unlimited rows.
              </li>
              <li>
                <strong><code>eq(commentary.matchId, id)</code></strong> — Drizzle's <code>eq</code> function generates <code>WHERE match_id = $1</code>. It uses parameterized queries internally, which prevents SQL injection.
              </li>
              <li>
                <strong><code>desc(commentary.createdAt)</code></strong> — <code>ORDER BY created_at DESC</code> — newest commentary first. Users want to see the latest events at the top.
              </li>
              <li>
                <strong><code>.limit(limit)</code></strong> — caps the number of rows returned. Without a limit, a match with 1000 commentary entries would return all of them, wasting bandwidth and memory.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This endpoint combines validation, filtering, ordering, and pagination in a single query. The <code>mergeParams</code> option is a common gotcha — without it, <code>req.params.id</code> is <code>undefined</code> and the query returns nothing.</p>
          </ExplanationBlock>
        </div>

        {/* Block 2 — POST commentary */}
        <div>
          <CodeBlock
            code={`commentaryRouter.post("/", async (req, res) => {
  try {
    const { id } = matchIdParamSchema.parse(req.params);
    const validated = createCommentarySchema.parse(req.body);

    const [newCommentary] = await db
      .insert(commentary)
      .values({ ...validated, matchId: id })
      .returning();

    if (req.app.locals.broadcastCommentary) {
      req.app.locals.broadcastCommentary(id, newCommentary);
    }

    res.status(201).json({ data: newCommentary });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ error: "Failed to create commentary" });
  }
});`}
          />
          <ExplanationBlock title="Line-by-line: POST /matches/:id/commentary">
            <ul>
              <li>
                <strong><code>matchIdParamSchema.parse(req.params)</code></strong> — validates the URL parameter again. Even though we validated in GET, each handler must validate independently because they can be called separately.
              </li>
              <li>
                <strong><code>createCommentarySchema.parse(req.body)</code></strong> — validates the commentary body (message, eventType, actor, etc). Strips unknown fields automatically if the schema uses <code>.strip()</code>.
              </li>
              <li>
                <strong><code>{"{ ...validated, matchId: id }"}</code></strong> — spreads the validated body and adds <code>matchId</code> from the URL. The match ID comes from the URL (<code>/matches/5/commentary</code>), not from the request body. This prevents clients from posting commentary to the wrong match.
              </li>
              <li>
                <strong><code>.returning()</code></strong> — returns the inserted row including the auto-generated <code>id</code> and <code>created_at</code> fields.
              </li>
              <li>
                <strong><code>broadcastCommentary(id, newCommentary)</code></strong> — pushes the new commentary to all WebSocket clients subscribed to this specific match. Only they receive it — clients watching other matches are not notified.
              </li>
              <li>
                <strong><code>res.status(201)</code></strong> — HTTP 201 Created. The response body contains the full commentary object as stored in the database, including server-generated fields.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This is the most important endpoint for "live" functionality. The moment a commentator posts an update, it's both persisted to the database AND pushed to all live viewers via WebSocket. The two channels (REST + WS) work together seamlessly.</p>
          </ExplanationBlock>
        </div>
      </div>
    </div>
  );
};
