import { ExplanationBlock, CodeBlock } from '../components/UiElements';

export const RoutesMatchesDoc = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] text-white p-8 text-center border-b border-slate-800">
        <h2 className="text-3xl font-extrabold mb-2 text-cyan-400">routes/matches.js</h2>
        <p className="text-slate-400">The "Orders Desk" for Matches</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        
        {/* Block 1 */}
        <div>
          <CodeBlock 
            code={`matchesRouter.get("/", async (req, res) => {
  const data = await db.select().from(matches);
  res.json({ data });
});`} 
          />
          <ExplanationBlock title="Getting the List">
            In simple words: <strong>"Show me the games!"</strong>
            <p className="mt-2">When a user asks for the list of matches, our app goes to the "Filing Cabinet" (Database), grabs all the match folders, and gives them to the user in a clean list.</p>
          </ExplanationBlock>
        </div>

        {/* Block 2 */}
        <div>
          <CodeBlock 
            code={`matchesRouter.post("/", async (req, res) => {
  const result = await db.insert(matches).values({...}).returning();
  
  if (req.app.locals.broadcastMatchCreated) {
    req.app.locals.broadcastMatchCreated(result[0]);
  }
});`} 
          />
          <ExplanationBlock title="Adding a New Game">
            In simple words: <strong>"Add a new match!"</strong>
            <div className="mt-2">When we create a new match, we do two things:
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>We save it in the Database so it's there forever.</li>
                <li>We press the <strong>Broadcast Button</strong> to tell everyone who is currently online: "Hey! A new game just started!"</li>
              </ol>
            </div>
          </ExplanationBlock>
        </div>

      </div>
    </div>
  );
};
