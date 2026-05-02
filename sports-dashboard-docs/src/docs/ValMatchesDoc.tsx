import { ExplanationBlock, CodeBlock } from '../components/UiElements';

export const ValMatchesDoc = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] text-white p-8 text-center border-b border-slate-800">
        <h2 className="text-3xl font-extrabold mb-2 text-cyan-400">validation/matches.js</h2>
        <p className="text-slate-400">The "Form Checker"</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        
        {/* Block 1 */}
        <div>
          <CodeBlock 
            code={`export const createMatchSchema = z.object({
  sport: z.string().min(1),
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
});`} 
          />
          <ExplanationBlock title="The Entry Requirements">
            In simple words: <strong>"Did you fill in everything?"</strong>
            <p className="mt-2">When someone adds a match, we check their work. If they forgot to name a team, this code stops them and says: "Wait! You forgot a team name!". This keeps our data clean and prevents mistakes.</p>
          </ExplanationBlock>
        </div>

      </div>
    </div>
  );
};
