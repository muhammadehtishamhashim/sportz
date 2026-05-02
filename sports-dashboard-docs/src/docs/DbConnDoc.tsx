import { ExplanationBlock, CodeBlock, PageHeader } from '../components/UiElements';

export const DbConnDoc = () => {
  return (
    <div>
      <PageHeader title="db/db.js" subtitle="Database connection pool & Drizzle client" />

      <div className="page-body">
        <div>
          <CodeBlock
            code={`import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("✅ Database connected successfully!");
});

export const db = drizzle(pool, { schema });`}
          />
          <ExplanationBlock title="Line-by-line: Database Connection">
            <ul>
              <li>
                <strong><code>import "dotenv/config"</code></strong> — loads environment variables from <code>.env</code> into <code>process.env</code>. This is a side-effect import — it runs immediately on import with no exported value. Must be imported before anything reads <code>process.env</code>.
              </li>
              <li>
                <strong><code>import pg from "pg"</code></strong> — the <code>pg</code> package (node-postgres) is the low-level PostgreSQL driver. Drizzle sits on top of it.
              </li>
              <li>
                <strong><code>const {"{ Pool }"} = pg</code></strong> — destructures <code>Pool</code> from the default export. A <code>Pool</code> manages multiple database connections and reuses them, which is much faster than opening a new connection per query.
              </li>
              <li>
                <strong><code>new Pool({"{ connectionString: process.env.DATABASE_URL }"})</code></strong> — creates the pool using a connection string like <code>postgresql://user:password@host:5432/dbname</code>. The pool will open connections lazily (on first query, not on creation).
              </li>
              <li>
                <strong><code>pool.on("connect")</code></strong> — event listener that fires each time a new connection is established in the pool. The <code>✅</code> log confirms the database is reachable.
              </li>
              <li>
                <strong><code>drizzle(pool, {"{ schema }"})</code></strong> — wraps the raw pool with Drizzle's query builder. Passing <code>schema</code> enables the relational query API and gives us type-safe access to all tables defined in <code>schema.js</code>.
              </li>
              <li>
                <strong><code>export const db</code></strong> — the Drizzle client. Every file that needs to query the database imports this <code>db</code> object and uses methods like <code>db.select()</code>, <code>db.insert()</code>, etc.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This is a single, shared database connection. The entire app imports <code>db</code> from this file. Connection pooling is critical — without it, every query would open and close a TCP connection to PostgreSQL, which is slow and resource-intensive.</p>
          </ExplanationBlock>
        </div>
      </div>
    </div>
  );
};
