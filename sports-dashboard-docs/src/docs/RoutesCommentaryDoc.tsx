import { ExplanationBlock, CodeBlock } from '../components/UiElements';

export const RoutesCommentaryDoc = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] text-white p-8 text-center border-b border-slate-800">
        <h2 className="text-3xl font-extrabold mb-2 text-cyan-400">routes/commentary.js</h2>
        <p className="text-slate-400">The "Commentary Booth"</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        
        {/* Block 1 */}
        <div>
          <CodeBlock 
            code={`commentaryRouter.get("/", async (req, res) => {
  const data = await db.select().from(commentary).where(eq(commentary.matchId, matchId));
  res.json({ data });
});`} 
          />
          <ExplanationBlock title="Reading the Updates">
            In simple words: <strong>"What happened in this game?"</strong>
            <p className="mt-2">This code looks through all the thousands of comments in our database and only picks out the ones that belong to the specific match the user is looking at. It's like searching a library for a specific book title.</p>
          </ExplanationBlock>
        </div>

        {/* Block 2 */}
        <div>
          <CodeBlock 
            code={`commentaryRouter.post("/", async (req, res) => {
  const [newCommentary] = await db.insert(commentary).values({...}).returning();

  if (req.app.locals.broadcastCommentary) {
    req.app.locals.broadcastCommentary(matchId, newCommentary);
  }
});`} 
          />
          <ExplanationBlock title="Sending a Live Update">
            In simple words: <strong>"Goal! Tell everyone!"</strong>
            <p className="mt-2">When something happens (like a goal or a card), we save the text in the database. Then, we immediately send that text over the "Live Phone Line" (WebSocket) only to the people who are watching that specific match.</p>
          </ExplanationBlock>
        </div>

      </div>
    </div>
  );
};
