import { ExplanationBlock, CodeBlock, PageHeader } from '../components/UiElements';

export const DbSchemaDoc = () => {
  return (
    <div>
      <PageHeader title="db/schema.js" subtitle="Database table definitions using Drizzle ORM" />

      <div className="page-body">
        {/* Block 1 — Enum */}
        <div>
          <CodeBlock
            code={`import { pgTable, serial, text, integer, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const matchStatus = pgEnum('match_status', ['scheduled', 'live', 'finished']);`}
          />
          <ExplanationBlock title="Line-by-line: Imports & Enum">
            <ul>
              <li>
                <strong><code>import {"{ pgTable, serial, text, ... }"} from "drizzle-orm/pg-core"</code></strong> — Drizzle ORM provides type-safe column builders. Each import (<code>serial</code>, <code>text</code>, <code>integer</code>, etc.) maps to a PostgreSQL column type.
              </li>
              <li>
                <strong><code>pgEnum('match_status', [...])</code></strong> — creates a PostgreSQL ENUM type. An enum restricts a column to only accept the listed values.
              </li>
              <li>
                <strong><code>['scheduled', 'live', 'finished']</code></strong> — the only valid states a match can be in. If someone tries to insert <code>"ongoing"</code>, PostgreSQL will reject it with a constraint error. This is database-level validation.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> Enums enforce data integrity at the database level, not just the application level. Even if a bug in the code tries to set an invalid status, the database itself will reject it. Defense in depth.</p>
          </ExplanationBlock>
        </div>

        {/* Block 2 — Matches table */}
        <div>
          <CodeBlock
            code={`export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  sport: text('sport').notNull(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  status: matchStatus('status').default('scheduled').notNull(),
  startTime: timestamp('start_time', { withTimezone: true }),
  endTime: timestamp('end_time', { withTimezone: true }),
  homeScore: integer('home_score').default(0).notNull(),
  awayScore: integer('away_score').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});`}
          />
          <ExplanationBlock title="Line-by-line: Matches Table">
            <ul>
              <li>
                <strong><code>pgTable('matches', {"{ ... }"})</code></strong> — defines a table named <code>matches</code> in PostgreSQL. Drizzle uses this schema to generate SQL queries and TypeScript types.
              </li>
              <li>
                <strong><code>serial('id').primaryKey()</code></strong> — auto-incrementing integer. Each new match gets the next number (1, 2, 3...). <code>primaryKey()</code> makes it the unique identifier and adds an index.
              </li>
              <li>
                <strong><code>text('sport').notNull()</code></strong> — a text column with <code>NOT NULL</code> constraint. The database will reject inserts that omit this field. The string <code>'sport'</code> is the actual column name in SQL.
              </li>
              <li>
                <strong><code>text('home_team')</code></strong> — note the naming: JavaScript uses <code>camelCase</code> (<code>homeTeam</code>) while SQL uses <code>snake_case</code> (<code>home_team</code>). Drizzle maps between them automatically.
              </li>
              <li>
                <strong><code>matchStatus('status').default('scheduled')</code></strong> — uses the enum we defined above. New matches default to <code>'scheduled'</code> if no status is provided.
              </li>
              <li>
                <strong><code>timestamp('start_time', {"{ withTimezone: true }"})</code></strong> — stores the date <em>with</em> timezone info (<code>TIMESTAMPTZ</code> in PostgreSQL). This prevents bugs when your server and users are in different timezones.
              </li>
              <li>
                <strong><code>integer('home_score').default(0)</code></strong> — scores start at 0. <code>integer</code> because scores are whole numbers.
              </li>
              <li>
                <strong><code>timestamp('created_at').defaultNow()</code></strong> — <code>defaultNow()</code> tells PostgreSQL to automatically set this to the current timestamp when a row is inserted. You never need to pass it manually.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This schema is the single source of truth for what a "match" looks like. Every query, insert, and update operates against this structure. If you add a column here, you need a migration to update the actual database.</p>
          </ExplanationBlock>
        </div>

        {/* Block 3 — Commentary table */}
        <div>
          <CodeBlock
            code={`export const commentary = pgTable('commentary', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').references(() => matches.id).notNull(),
  minutes: integer('minutes'),
  sequence: integer('sequence'),
  period: text('period'),
  eventType: text('event_type'),
  actor: text('actor'),
  team: text('team'),
  message: text('message').notNull(),
  metadata: jsonb('metadata'),
  tags: text('tags').array(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});`}
          />
          <ExplanationBlock title="Line-by-line: Commentary Table">
            <ul>
              <li>
                <strong><code>matchId: integer('match_id').references(() =&gt; matches.id)</code></strong> — a <strong>foreign key</strong>. This column must contain an <code>id</code> that exists in the <code>matches</code> table. PostgreSQL will reject inserts referencing a non-existent match. The arrow function <code>() =&gt; matches.id</code> avoids circular import issues.
              </li>
              <li>
                <strong><code>minutes: integer('minutes')</code></strong> — the game minute when this event happened (e.g., 45 = halftime). Optional (<code>notNull</code> is absent), because some events like "kickoff" don't have a specific minute.
              </li>
              <li>
                <strong><code>sequence: integer('sequence')</code></strong> — ordering number for events within the same minute. If two things happen at minute 65, sequence distinguishes which came first.
              </li>
              <li>
                <strong><code>eventType: text('event_type')</code></strong> — categorizes the event: <code>"goal"</code>, <code>"yellow_card"</code>, <code>"substitution"</code>, etc. Used for filtering and styling on the frontend.
              </li>
              <li>
                <strong><code>message: text('message').notNull()</code></strong> — the human-readable commentary text. This is the only required field besides <code>matchId</code>.
              </li>
              <li>
                <strong><code>metadata: jsonb('metadata')</code></strong> — <code>JSONB</code> stores arbitrary JSON data. This is a flexible "catch-all" for extra info that doesn't deserve its own column (e.g., VAR decision details, injury info).
              </li>
              <li>
                <strong><code>tags: text('tags').array()</code></strong> — a PostgreSQL text array. Stores multiple tags per row like <code>["important", "goal", "highlight"]</code>. More efficient than a separate tags table for simple use cases.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> The foreign key to <code>matches.id</code> creates a one-to-many relationship — one match has many commentary entries. The <code>JSONB</code> and array columns show a hybrid approach: structured columns for known fields, flexible JSON for everything else.</p>
          </ExplanationBlock>
        </div>
      </div>
    </div>
  );
};
