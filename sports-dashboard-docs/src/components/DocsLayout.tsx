import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

type FileNode = {
  name: string;
  path: string;
  id: string;
};

const FILES: FileNode[] = [
  { name: 'index.js', path: 'src/', id: 'index' },
  { name: 'server.js', path: 'ws/', id: 'ws_server' },
  { name: 'schema.js', path: 'db/', id: 'db_schema' },
  { name: 'db.js', path: 'db/', id: 'db_conn' },
  { name: 'matches.js', path: 'routes/', id: 'routes_matches' },
  { name: 'commentary.js', path: 'routes/', id: 'routes_commentary' },
  { name: 'arcjet.js', path: 'src/', id: 'arcjet' },
  { name: 'seed.js', path: 'seed/', id: 'seed' },
  { name: 'match-status.js', path: 'utils/', id: 'utils_status' },
  { name: 'matches.js', path: 'validation/', id: 'val_matches' },
  { name: 'commentary.js', path: 'validation/', id: 'val_commentary' },
];

export const DocsLayout: React.FC<{
  activeId: string;
  onNavigate: (id: string) => void;
  children: React.ReactNode;
}> = ({ activeId, onNavigate, children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          sportz <span>/ docs</span>
        </div>

        <div className="sidebar__section-label">Codebase</div>
        <nav className="sidebar__nav">
          {FILES.map((file) => (
            <button
              key={file.id}
              onClick={() => onNavigate(file.id)}
              className={`sidebar__item ${activeId === file.id ? 'sidebar__item--active' : ''}`}
            >
              <span className="sidebar__item-path">{file.path}</span>
              <span>{file.name}</span>
            </button>
          ))}
        </nav>

        {/* Theme toggle */}
        <div className="sidebar__footer">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};
