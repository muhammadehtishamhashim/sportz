import { ExplanationBlock, CodeBlock, PageHeader } from '../components/UiElements';

export const ValMatchesDoc = () => {
  return (
    <div>
      <PageHeader title="validation/matches.js" subtitle="Zod schemas for request validation on match endpoints" />

      <div className="page-body">
        {/* Block 1 — Helper & Constants */}
        <div>
          <CodeBlock
            code={`import { z } from 'zod';

const isValidISODate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString();
};

export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};`}
          />
          <ExplanationBlock title="Line-by-line: Imports, Helpers & Constants">
            <ul>
              <li>
                <strong><code>import {"{ z }"} from 'zod'</code></strong> — Zod is a TypeScript-first schema validation library. Unlike Joi or Yup, Zod infers TypeScript types from schemas automatically. <code>z</code> is the namespace for all validators.
              </li>
              <li>
                <strong><code>isValidISODate(dateString)</code></strong> — a custom validator function. Zod's built-in <code>z.string()</code> can't validate date formats, so we write our own.
              </li>
              <li>
                <strong><code>new Date(dateString)</code></strong> — tries to parse the string as a date. JavaScript's Date constructor is very lenient — it accepts <code>"banana"</code> and returns <code>Invalid Date</code>.
              </li>
              <li>
                <strong><code>!isNaN(date.getTime())</code></strong> — <code>getTime()</code> returns <code>NaN</code> for invalid dates. This check ensures the string was actually parseable as a date.
              </li>
              <li>
                <strong><code>dateString === date.toISOString()</code></strong> — the strict check. <code>"2025-01-15"</code> parses successfully but <code>.toISOString()</code> returns <code>"2025-01-15T00:00:00.000Z"</code>. They don't match, so we reject it. We only accept the full ISO format like <code>"2025-01-15T14:30:00.000Z"</code>. This prevents ambiguous date formats.
              </li>
              <li>
                <strong><code>MATCH_STATUS</code></strong> — a constants object. Using named constants instead of raw strings prevents typos. If you write <code>MATCH_STATUS.LIVE</code> and mistype it, you get a runtime error. If you write <code>"lve"</code>, you get silent bugs.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> The ISO date validator is intentionally strict. Accepting loose date formats (like <code>"Jan 15 2025"</code> or <code>"2025/01/15"</code>) leads to timezone and parsing bugs across different environments. Enforcing ISO 8601 eliminates ambiguity.</p>
          </ExplanationBlock>
        </div>

        {/* Block 2 — Query & Param schemas */}
        <div>
          <CodeBlock
            code={`export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});`}
          />
          <ExplanationBlock title="Line-by-line: Query & Param Schemas">
            <ul>
              <li>
                <strong><code>z.object({"{ ... }"})</code></strong> — defines a schema that validates a plain object. When used with <code>.parse(req.query)</code>, it checks each property against its rules.
              </li>
              <li>
                <strong><code>z.coerce.number()</code></strong> — <strong>key detail:</strong> URL query params and route params are <em>always strings</em> (<code>req.query.limit</code> is <code>"20"</code>, not <code>20</code>). <code>z.coerce</code> converts the string to a number first, then validates. Without <code>coerce</code>, <code>"20"</code> would fail <code>z.number()</code> because it's a string.
              </li>
              <li>
                <strong><code>.int()</code></strong> — rejects floating-point numbers. Limits and IDs must be whole numbers — <code>10.5</code> makes no sense as a row count.
              </li>
              <li>
                <strong><code>.positive()</code></strong> — rejects <code>0</code> and negative numbers. A limit of <code>0</code> would return nothing, and a negative ID doesn't exist.
              </li>
              <li>
                <strong><code>.max(100)</code></strong> — caps the limit at 100 rows. Without this, a client could request <code>?limit=999999</code> and force the server to load the entire table into memory.
              </li>
              <li>
                <strong><code>.optional()</code></strong> — the limit parameter is not required. If omitted, the route handler uses a default value. The <code>id</code> param is <em>not</em> optional — every match-specific route needs one.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> <code>z.coerce</code> is the most important keyword here. It solves the #1 Express validation gotcha: everything from the URL is a string. Without coercion, you'd need manual <code>parseInt()</code> calls in every route handler.</p>
          </ExplanationBlock>
        </div>

        {/* Block 3 — Create match schema */}
        <div>
          <CodeBlock
            code={`export const createMatchSchema = z.object({
  sport: z.string().min(1, 'Sport is required'),
  homeTeam: z.string().min(1, 'Home team is required'),
  awayTeam: z.string().min(1, 'Away team is required'),
  startTime: z.string().refine(isValidISODate, 'Start time must be a valid ISO date string'),
  endTime: z.string().refine(isValidISODate, 'End time must be a valid ISO date string'),
  homeScore: z.coerce.number().int().min(0).optional(),
  awayScore: z.coerce.number().int().min(0).optional(),
}).superRefine((data, ctx) => {
  const startDate = new Date(data.startTime);
  const endDate = new Date(data.endTime);
  if (endDate <= startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'End time must be after start time',
      path: ['endTime'],
    });
  }
});`}
          />
          <ExplanationBlock title="Line-by-line: Create Match Schema">
            <ul>
              <li>
                <strong><code>z.string().min(1, 'Sport is required')</code></strong> — requires a non-empty string. <code>.min(1)</code> rejects empty strings (<code>""</code>). The second argument is the custom error message shown to the client.
              </li>
              <li>
                <strong><code>.refine(isValidISODate, '...')</code></strong> — <code>.refine()</code> adds a custom validation function to a chain. Zod first checks it's a string, then passes it to <code>isValidISODate</code>. If it returns <code>false</code>, the error message is used.
              </li>
              <li>
                <strong><code>z.coerce.number().int().min(0)</code></strong> — scores can be <code>0</code> (that's a valid score) but not negative. <code>.min(0)</code> allows zero, unlike <code>.positive()</code> which requires <code>&gt;= 1</code>.
              </li>
              <li>
                <strong><code>.optional()</code></strong> — scores default to <code>0</code> in the database schema, so they don't need to be provided on creation.
              </li>
              <li>
                <strong><code>.superRefine((data, ctx) =&gt; {"{ ... }"})</code></strong> — <strong>cross-field validation</strong>. Regular <code>.refine()</code> validates individual fields. <code>.superRefine()</code> runs after all field validations pass, giving access to the entire parsed object. This is where you validate relationships between fields.
              </li>
              <li>
                <strong><code>endDate &lt;= startDate</code></strong> — a match can't end before (or at the same time as) it starts. This catches logical errors like swapped dates.
              </li>
              <li>
                <strong><code>ctx.addIssue({"{ ... }"})</code></strong> — manually adds a validation error. <code>path: ['endTime']</code> tells the client which field has the problem. The <code>code: z.ZodIssueCode.custom</code> marks this as a custom validation rule.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> <code>superRefine</code> is the key pattern here. Single-field validation (<code>.min()</code>, <code>.refine()</code>) catches format errors. Cross-field validation (<code>superRefine</code>) catches logic errors. Together, they guarantee that only valid, logical data reaches the database.</p>
          </ExplanationBlock>
        </div>

        {/* Block 4 — Update score schema */}
        <div>
          <CodeBlock
            code={`export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().min(0),
  awayScore: z.coerce.number().int().min(0),
});`}
          />
          <ExplanationBlock title="Line-by-line: Update Score Schema">
            <ul>
              <li>
                <strong><code>updateScoreSchema</code></strong> — a separate, focused schema just for score updates. It only accepts <code>homeScore</code> and <code>awayScore</code> — no team names, no dates. This prevents clients from modifying fields they shouldn't during a score update.
              </li>
              <li>
                <strong>No <code>.optional()</code></strong> — both scores are required. When updating the score, you must provide both. This prevents partial updates where only one score changes and the other silently stays the same.
              </li>
              <li>
                <strong><code>.min(0)</code></strong> — scores can't go negative. In real sports, scores only go up (or stay the same in corrections). If you need score decrements, you'd change this to allow it explicitly.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> Having a separate schema per operation (create, update-score) is a best practice. It enforces the principle of least privilege — each endpoint only accepts the exact fields it needs, nothing more.</p>
          </ExplanationBlock>
        </div>
      </div>
    </div>
  );
};
