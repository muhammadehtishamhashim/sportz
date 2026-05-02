import { ExplanationBlock, CodeBlock } from '../components/UiElements';

export const DbSchemaDoc = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] text-white p-8 text-center border-b border-slate-800">
        <h2 className="text-3xl font-extrabold mb-2 text-cyan-400">db/schema.js</h2>
        <p className="text-slate-400">The "Organized Filing Cabinet"</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        
        {/* Block 1 */}
        <div>
          <CodeBlock 
            code={`export const matchStatus = pgEnum('match_status', ['scheduled', 'live', 'finished']);`} 
          />
          <ExplanationBlock title="The Labeling System">
            In simple words: <strong>What can we call a match?</strong>
            <p className="mt-2">We don't want someone to accidentally type "ongoing" or "done". We create strict labels. A match can ONLY be <code>scheduled</code>, <code>live</code>, or <code>finished</code>. It's like a multiple-choice question where you can't write your own answer.</p>
          </ExplanationBlock>
        </div>

        {/* Block 2 */}
        <div>
          <CodeBlock 
            code={`export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  homeScore: integer('home_score').default(0).notNull(),
});`} 
          />
          <ExplanationBlock title="The 'Match Info' Folder">
            In simple words: <strong>Storing the basic facts!</strong>
            <p className="mt-2">This is the blueprint for a match. Every match MUST have a home team and an away team. We also keep track of the score, starting at 0. The <code>id</code> is like a unique "Social Security Number" for each match.</p>
          </ExplanationBlock>
        </div>

        {/* Block 3 */}
        <div>
          <CodeBlock 
            code={`export const commentary = pgTable('commentary', {
  matchId: integer('match_id').references(() => matches.id),
  message: text('message'),
});`} 
          />
          <ExplanationBlock title="The 'Commentary' Folder">
            In simple words: <strong>Storing the story of the game!</strong>
            <p className="mt-2">This table stores every single update (like "Yellow Card" or "Goal!"). The <code>matchId</code> is like a "Paperclip" that clips this comment to the correct match. Without it, we wouldn't know which game the comment belongs to!</p>
          </ExplanationBlock>
        </div>

      </div>
    </div>
  );
};
