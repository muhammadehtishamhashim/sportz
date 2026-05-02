import { ExplanationBlock, CodeBlock } from '../components/UiElements';

export const ArcjetDoc = () => {
  return (
    <div className="w-full">
      <div className="bg-[#1e1e1e] text-white p-8 text-center border-b border-slate-800">
        <h2 className="text-3xl font-extrabold mb-2 text-cyan-400">arcjet.js</h2>
        <p className="text-slate-400">The "Security Guard" of the App</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        
        {/* Block 1 */}
        <div>
          <CodeBlock 
            code={`rules: [
  shield({ mode: arcjetMode }),
  detectBot({ ... }),
  slidingWindow({ interval: "10s", max: 50 }),
]`} 
          />
          <ExplanationBlock title="The Security Rules">
            In simple words: <strong>The Guard's Instructions!</strong>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong>Shield:</strong> Like an "Armor" that stops hackers from breaking our database.</li>
              <li><strong>Bot Detection:</strong> Like a "Fake Person Detector". It stops robots but lets real humans (and Google Search) through.</li>
              <li><strong>Sliding Window:</strong> Like a "Limit on Requests". It says: "You can only ask for data 50 times in 10 seconds." This stops people from crashing our app by asking too many questions at once.</li>
            </ul>
          </ExplanationBlock>
        </div>

        {/* Block 2 */}
        <div>
          <CodeBlock 
            code={`const decision = await httpArcjet.protect(req);
if (decision.isDenied()) {
  return res.status(403).json({ error: "Access forbidden" });
}`} 
          />
          <ExplanationBlock title="The Decision">
            In simple words: <strong>Letting them in or kicking them out!</strong>
            <p className="mt-2">For every single person who visits our app, we ask the Guard (Arcjet): "Is this person okay?". If the Guard says "No", we show them a <strong>403 Forbidden</strong> error and they can't see anything. This keeps our app safe and fast.</p>
          </ExplanationBlock>
        </div>

      </div>
    </div>
  );
};
