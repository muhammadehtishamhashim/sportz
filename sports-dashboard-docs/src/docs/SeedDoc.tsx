import { ExplanationBlock, CodeBlock, PageHeader } from '../components/UiElements';

export const SeedDoc = () => {
  return (
    <div>
      <PageHeader title="seed/seed.js" subtitle="Populates the database with sample data" />

      <div className="page-body">
        <div>
          <CodeBlock
            code={`import "dotenv/config";
import { db } from "../db/db.js";
import { matches, commentary } from "../db/schema.js";
import sampleData from "../data/data.json" with { type: "json" };

async function seed() {
  console.log("🌱 Seeding database...");

  // Insert matches
  const insertedMatches = await db
    .insert(matches)
    .values(sampleData.matches)
    .returning();

  // Insert commentary linked to matches
  for (const match of insertedMatches) {
    const matchCommentary = sampleData.commentary.map((c) => ({
      ...c,
      matchId: match.id,
    }));
    await db.insert(commentary).values(matchCommentary);
  }

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});`}
          />
          <ExplanationBlock title="Line-by-line: Database Seeding">
            <ul>
              <li>
                <strong><code>import "dotenv/config"</code></strong> — loads <code>.env</code> so the database URL is available. This script runs standalone (<code>node src/seed/seed.js</code>), so it needs its own dotenv import.
              </li>
              <li>
                <strong><code>import sampleData from "../data/data.json" with {"{ type: \"json\" }"}</code></strong> — Node's JSON import syntax for ES modules. The <code>with {"{ type: \"json\" }"}</code> assertion is required in modern Node to import JSON files directly.
              </li>
              <li>
                <strong><code>db.insert(matches).values(sampleData.matches)</code></strong> — bulk insert. Drizzle accepts an array of objects and generates a single <code>INSERT INTO matches VALUES (...), (...), (...)</code> statement. Much faster than individual inserts.
              </li>
              <li>
                <strong><code>.returning()</code></strong> — returns the inserted rows with their auto-generated <code>id</code> values. We need these IDs to link commentary to the correct match.
              </li>
              <li>
                <strong><code>for (const match of insertedMatches)</code></strong> — iterates over each inserted match to create commentary entries linked to it via <code>matchId</code>.
              </li>
              <li>
                <strong><code>{"{ ...c, matchId: match.id }"}</code></strong> — spreads the sample commentary and adds the foreign key. Each commentary entry is now linked to a real match.
              </li>
              <li>
                <strong><code>process.exit(0)</code></strong> — exits with code 0 (success). Without this, the script would hang because the database pool keeps the Node process alive.
              </li>
              <li>
                <strong><code>process.exit(1)</code></strong> — exits with code 1 (failure). CI/CD pipelines use this to detect failed seed scripts and stop the deployment.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> Seed scripts let you test with realistic data immediately. Without them, every developer would need to manually create matches and commentary through the API. They're also critical for CI — automated tests need a known database state.</p>
          </ExplanationBlock>
        </div>
      </div>
    </div>
  );
};
