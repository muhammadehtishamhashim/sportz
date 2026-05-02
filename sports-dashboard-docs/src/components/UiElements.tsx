import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

// --- Tab System ---
export const TabContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="w-full">{children}</div>;
};

export const TabList: React.FC<{
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8 justify-center">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          onClick={() => setActiveTab(index)}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm border ${
            activeTab === index
              ? 'bg-indigo-600 text-white border-indigo-500 scale-105 shadow-md'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export const TabPanel: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
}> = ({ children, isActive }) => {
  if (!isActive) return null;
  return (
    <div className="p-6 md:p-10 animate-[slideUp_0.4s_ease-out_forwards]">
      {children}
    </div>
  );
};

// --- Dark Mode / Cyan Themed Explanation Component ---
export const ExplanationBlock: React.FC<{
  title?: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <div className="p-5 rounded-xl border shadow-sm mb-6 bg-cyan-950/30 border-cyan-500/30 text-cyan-100">
      {title && (
        <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-cyan-400">
          {title}
        </h4>
      )}
      <div className="text-sm leading-relaxed opacity-90 space-y-2">{children}</div>
    </div>
  );
};

// --- Colorful Code Block Component ---
export const CodeBlock: React.FC<{ code: string; title?: string }> = ({ code, title }) => {
  return (
    <div className="bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden mb-6 border border-slate-800">
      {title && (
        <div className="bg-[#1e1e1e] px-4 py-3 border-b border-slate-800 flex justify-between items-center">
          <span className="text-xs font-mono text-slate-400">{title}</span>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
          </div>
        </div>
      )}
      <div className="text-sm">
        <SyntaxHighlighter 
          language="javascript" 
          style={syntaxStyle}
          customStyle={{ margin: 0, padding: '1rem', background: '#1e1e1e' }}
          showLineNumbers={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
