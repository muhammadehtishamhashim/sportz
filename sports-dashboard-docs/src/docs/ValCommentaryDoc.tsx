import { ExplanationBlock, CodeBlock, PageHeader } from '../components/UiElements';

export const ValCommentaryDoc = () => {
  return (
    <div>
      <PageHeader title="validation/commentary.js" subtitle="Zod schemas for commentary request validation" />

      <div className="page-body">
        {/* Block 1 — List query schema */}
        <div>
          <CodeBlock
            code={`import { z } from 'zod';

export const listCommentaryQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});`}
          />
          <ExplanationBlock title="Line-by-line: List Query Schema">
            <ul>
              <li>
                <strong><code>import {"{ z }"} from 'zod'</code></strong> — imports the Zod namespace. Every validator method is accessed through <code>z</code>.
              </li>
              <li>
                <strong><code>listCommentaryQuerySchema</code></strong> — validates <code>req.query</code> for the <code>GET /matches/:id/commentary</code> endpoint. Query strings are parsed from the URL (e.g., <code>?limit=20</code>).
              </li>
              <li>
                <strong><code>z.coerce.number()</code></strong> — query parameters arrive as strings from the URL. <code>z.coerce</code> runs <code>Number(value)</code> before validation. Without it, <code>"20"</code> would fail <code>z.number()</code> because it's a string.
              </li>
              <li>
                <strong><code>.int().positive()</code></strong> — must be a whole number greater than zero. <code>.int()</code> rejects <code>10.5</code>; <code>.positive()</code> rejects <code>0</code> and negatives. Requesting zero rows makes no sense.
              </li>
              <li>
                <strong><code>.max(100)</code></strong> — prevents abuse. A live match could have hundreds of commentary entries. Without a cap, a client requesting <code>?limit=10000</code> would force the server to serialize a massive JSON response.
              </li>
              <li>
                <strong><code>.optional()</code></strong> — if no <code>limit</code> is provided, the route handler decides the default (typically 50). The schema doesn't enforce a default — that's the route's responsibility.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This schema is identical in structure to <code>listMatchesQuerySchema</code> in the matches validation file. They share the same pattern because every list endpoint needs the same protections: type coercion, bounds checking, and optional pagination.</p>
          </ExplanationBlock>
        </div>

        {/* Block 2 — Create commentary schema */}
        <div>
          <CodeBlock
            code={`export const createCommentarySchema = z.object({
  minute: z.number().int().nonnegative().optional(),
  sequence: z.number().int().optional(),
  period: z.string().optional(),
  eventType: z.string().optional(),
  actor: z.string().optional(),
  team: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  metadata: z.record(z.string(), z.unknown()).optional(),
  tags: z.array(z.string()).optional(),
});`}
          />
          <ExplanationBlock title="Line-by-line: Create Commentary Schema">
            <ul>
              <li>
                <strong><code>minute: z.number().int().nonnegative().optional()</code></strong> — the game minute (0, 1, 2, ... 90+). <code>.nonnegative()</code> allows <code>0</code> (kickoff) but rejects <code>-1</code>. Uses <code>z.number()</code> (not <code>z.coerce.number()</code>) because this comes from a JSON body, not a URL — JSON already parses numbers correctly.
              </li>
              <li>
                <strong><code>sequence: z.number().int().optional()</code></strong> — ordering within the same minute. If two events happen at minute 45, sequence determines which comes first (1, 2, 3...). Optional because not all events need explicit ordering.
              </li>
              <li>
                <strong><code>period: z.string().optional()</code></strong> — e.g., <code>"first_half"</code>, <code>"second_half"</code>, <code>"extra_time"</code>. Kept as a free-form string (not an enum) for flexibility across different sports.
              </li>
              <li>
                <strong><code>eventType: z.string().optional()</code></strong> — categorizes the event: <code>"goal"</code>, <code>"yellow_card"</code>, <code>"substitution"</code>, <code>"kickoff"</code>, etc. The frontend can use this to render different icons or styles per event type.
              </li>
              <li>
                <strong><code>actor: z.string().optional()</code></strong> — the player or person involved (e.g., <code>"M. Salah"</code>). Optional because some events (like "end of half") don't have a specific actor.
              </li>
              <li>
                <strong><code>team: z.string().optional()</code></strong> — which team the event belongs to. Optional for neutral events like <code>"halftime"</code>.
              </li>
              <li>
                <strong><code>message: z.string().min(1, 'Message is required')</code></strong> — the <strong>only required field</strong>. This is the human-readable commentary text. <code>.min(1)</code> prevents empty strings — every commentary entry must say something.
              </li>
              <li>
                <strong><code>metadata: z.record(z.string(), z.unknown()).optional()</code></strong> — a catch-all JSON object. <code>z.record(z.string(), z.unknown())</code> means an object with string keys and any values. This maps to PostgreSQL's <code>JSONB</code> column. Use it for extra data that doesn't fit the structured fields (e.g., VAR decision details, injury info).
              </li>
              <li>
                <strong><code>tags: z.array(z.string()).optional()</code></strong> — an array of string tags like <code>["highlight", "goal", "important"]</code>. Maps to PostgreSQL's <code>text[]</code> array column. Useful for filtering/searching commentary.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> Notice that only <code>message</code> is required — everything else is optional. This is a deliberately flexible schema. Different sports have different data needs (cricket has overs, football has halves, basketball has quarters). By making fields optional, the same API works for all sports without separate schemas per sport.</p>
          </ExplanationBlock>
        </div>

        {/* Block 3 — Design decisions */}
        <div>
          <ExplanationBlock title="Design Pattern: z.number() vs z.coerce.number()">
            <ul>
              <li>
                <strong><code>z.coerce.number()</code></strong> — used in query/param schemas (<code>listCommentaryQuerySchema</code>) because URL parameters are always strings. <code>z.coerce</code> converts <code>"20"</code> → <code>20</code> before validating.
              </li>
              <li>
                <strong><code>z.number()</code></strong> — used in body schemas (<code>createCommentarySchema</code>) because JSON bodies preserve types. When <code>express.json()</code> parses <code>{"{ \"minute\": 45 }"}</code>, the value is already a number <code>45</code>, not a string <code>"45"</code>.
              </li>
              <li>
                <strong>Rule of thumb:</strong> use <code>z.coerce</code> for <code>req.params</code> and <code>req.query</code>; use plain <code>z.number()</code> / <code>z.string()</code> for <code>req.body</code>.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> Mixing up coerce vs non-coerce is a common source of validation bugs. If you use <code>z.number()</code> on a query param, valid requests fail silently. If you use <code>z.coerce</code> on a body field, you might accidentally accept strings where you wanted numbers.</p>
          </ExplanationBlock>
        </div>
      </div>
    </div>
  );
};
