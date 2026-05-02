import { ExplanationBlock, CodeBlock } from '../components/UiElements';

export const UtilsStatusDoc = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] text-white p-8 text-center border-b border-slate-800">
        <h2 className="text-3xl font-extrabold mb-2 text-cyan-400">utils/match-status.js</h2>
        <p className="text-slate-400">The "Automatic Clock"</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        
        {/* Block 1 */}
        <div>
          <CodeBlock 
            code={`if (now < start) return 'scheduled';
if (now > end) return 'finished';
return 'live';`} 
          />
          <ExplanationBlock title="Checking the Time">
            In simple words: <strong>What time is it right now?</strong>
            <p className="mt-2">This small bit of code is like a "Smart Assistant". Instead of us telling the app when a game starts, it constantly checks the clock. If the current time is between the start and end, it automatically tells the app "The game is LIVE right now!".</p>
          </ExplanationBlock>
        </div>

      </div>
    </div>
  );
};
