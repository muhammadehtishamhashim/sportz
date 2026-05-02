import { ExplanationBlock, CodeBlock } from '../components/UiElements';

export const ValCommentaryDoc = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] text-white p-8 text-center border-b border-slate-800">
        <h2 className="text-3xl font-extrabold mb-2 text-cyan-400">validation/commentary.js</h2>
        <p className="text-slate-400">The "Commentary Checker"</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        
        {/* Block 1 */}
        <div>
          <CodeBlock 
            code={`export const createCommentarySchema = z.object({
  message: z.string().min(1, 'Message is required'),
});`} 
          />
          <ExplanationBlock title="The Message Check">
            In simple words: <strong>"Don't send empty comments!"</strong>
            <p className="mt-2">This makes sure every live update actually has text. If someone tries to send a "Blank" update, the app will block it. It ensures that users always see useful information.</p>
          </ExplanationBlock>
        </div>

      </div>
    </div>
  );
};
