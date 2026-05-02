import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

// ─── Code Block ───
export const CodeBlock: React.FC<{ code: string; title?: string; language?: string }> = ({
  code,
  title,
  language = 'javascript',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      {/* Minimal header — title + copy */}
      <div className="code-block__header">
        {title && <span className="code-block__title">{title}</span>}
        <button onClick={handleCopy} className="code-block__copy" title="Copy code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied && <span>Copied</span>}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          background: 'transparent',
          fontSize: '0.8125rem',
          lineHeight: '1.7',
        }}
        showLineNumbers
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          color: '#3a3f4b',
          fontSize: '0.75rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// ─── Explanation Block ───
export const ExplanationBlock: React.FC<{
  title?: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <div className="explanation-block">
      {title && <h4 className="explanation-block__title">{title}</h4>}
      <div className="explanation-block__body">{children}</div>
    </div>
  );
};

// ─── Page Header ───
export const PageHeader: React.FC<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => {
  return (
    <div className="page-header">
      <h2 className="page-header__title">{title}</h2>
      <p className="page-header__subtitle">{subtitle}</p>
    </div>
  );
};

// ─── Tab System ───
export const TabContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="w-full">{children}</div>;
};

export const TabList: React.FC<{
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="tab-list">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          onClick={() => setActiveTab(index)}
          className={`tab-list__item ${activeTab === index ? 'tab-list__item--active' : ''}`}
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
  return <div className="tab-panel">{children}</div>;
};
