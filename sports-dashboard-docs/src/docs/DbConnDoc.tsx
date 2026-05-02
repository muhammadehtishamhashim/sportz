import { ExplanationBlock, CodeBlock } from '../components/UiElements';

export const DbConnDoc = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] text-white p-8 text-center border-b border-slate-800">
        <h2 className="text-3xl font-extrabold mb-2 text-cyan-400">db/db.js</h2>
        <p className="text-slate-400">The "Database Connection"</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        
        {/* Block 1 */}
        <div>
          <CodeBlock 
            code={`export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});`} 
          />
          <ExplanationBlock title="Connecting the Wires">
            In simple words: <strong>Linking our App to our Storage!</strong>
            <p className="mt-2">The <code>DATABASE_URL</code> is like a "Special Address" where our data is kept (like a safe). This code opens a permanent connection to that safe so we can quickly store and retrieve data whenever we want.</p>
          </ExplanationBlock>
        </div>

      </div>
    </div>
  );
};
