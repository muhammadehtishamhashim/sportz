import { ExplanationBlock, CodeBlock } from '../components/UiElements';

export const SeedDoc = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] text-white p-8 text-center border-b border-slate-800">
        <h2 className="text-3xl font-extrabold mb-2 text-cyan-400">seed/seed.js</h2>
        <p className="text-slate-400">The "Starter Data" Script</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        
        {/* Block 1 */}
        <div>
          <CodeBlock 
            code={`await db.insert(matches).values([...]);`} 
          />
          <ExplanationBlock title="Filling the Cabinet">
            In simple words: <strong>Putting dummy data into the app!</strong>
            <p className="mt-2">When you first start, the app is empty. This script is like a "Magic Wand" that creates 10 fake matches and 50 fake comments instantly. This way, you can see how the app looks with real data without having to type everything manually.</p>
          </ExplanationBlock>
        </div>

      </div>
    </div>
  );
};
