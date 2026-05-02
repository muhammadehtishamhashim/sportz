import { ExplanationBlock, CodeBlock, PageHeader } from '../components/UiElements';

export const UtilsStatusDoc = () => {
  return (
    <div>
      <PageHeader title="utils/match-status.js" subtitle="Automatic match status based on timestamps" />

      <div className="page-body">
        <div>
          <CodeBlock
            code={`export function computeMatchStatus(startTime, endTime) {
  const now = new Date();

  if (!startTime) return "scheduled";
  if (now < new Date(startTime)) return "scheduled";
  if (endTime && now > new Date(endTime)) return "finished";
  return "live";
}`}
          />
          <ExplanationBlock title="Line-by-line: Status Computation">
            <ul>
              <li>
                <strong><code>export function computeMatchStatus(startTime, endTime)</code></strong> — a pure function: same inputs always produce the same output (for a given moment in time). No database calls, no side effects.
              </li>
              <li>
                <strong><code>const now = new Date()</code></strong> — captures the current timestamp. All comparisons below are against this single snapshot to avoid race conditions within the function.
              </li>
              <li>
                <strong><code>if (!startTime) return "scheduled"</code></strong> — guard clause. If no start time is set, the match hasn't been scheduled with a time yet — treat it as <code>scheduled</code>.
              </li>
              <li>
                <strong><code>now &lt; new Date(startTime)</code></strong> — the match hasn't started yet. <code>new Date(startTime)</code> converts the string/timestamp to a Date object for comparison.
              </li>
              <li>
                <strong><code>endTime && now &gt; new Date(endTime)</code></strong> — short-circuit: only checks the end time if it exists. Some matches may not have an end time set (in-progress). If end time exists and it's in the past, the match is <code>finished</code>.
              </li>
              <li>
                <strong><code>return "live"</code></strong> — the fallthrough case. If none of the above returned, we're between start and end → the match is live.
              </li>
            </ul>
            <p><strong>Why this matters:</strong> This function eliminates manual status updates. Instead of an admin toggling "live" and "finished", the system derives it from timestamps. The status is always accurate and can't get stuck in "live" after the game ends because someone forgot to update it.</p>
          </ExplanationBlock>
        </div>
      </div>
    </div>
  );
};
