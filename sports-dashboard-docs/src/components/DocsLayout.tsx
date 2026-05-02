import React from 'react';

type FileNode = {
  name: string;
  path: string;
  id: string;
};

const FILES: FileNode[] = [
  { name: 'index.js', path: 'src/', id: 'index' },
  { name: 'server.js', path: 'src/ws/', id: 'ws_server' },
  { name: 'schema.js', path: 'src/db/', id: 'db_schema' },
  { name: 'db.js', path: 'src/db/', id: 'db_conn' },
  { name: 'matches.js', path: 'src/routes/', id: 'routes_matches' },
  { name: 'commentary.js', path: 'src/routes/', id: 'routes_commentary' },
  { name: 'arcjet.js', path: 'src/', id: 'arcjet' },
  { name: 'seed.js', path: 'src/seed/', id: 'seed' },
  { name: 'match-status.js', path: 'src/utils/', id: 'utils_status' },
  { name: 'matches.js', path: 'src/validation/', id: 'val_matches' },
  { name: 'commentary.js', path: 'src/validation/', id: 'val_commentary' },
];

export const DocsLayout: React.FC<{
  activeId: string;
  onNavigate: (id: string) => void;
  children: React.ReactNode;
}> = ({ activeId, onNavigate, children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-slate-900 text-slate-300 md:min-h-screen p-6 border-r border-slate-800 shrink-0">
        <h1 className="text-xl font-extrabold text-white mb-8 tracking-tight">
          Sports <span className="text-cyan-400">Dashboard</span> Docs
        </h1>
        
        <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">Codebase</h3>
        <nav className="space-y-2">
          {FILES.map((file) => (
            <button
              key={file.id}
              onClick={() => onNavigate(file.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center overflow-hidden ${
                activeId === file.id
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 font-medium shadow-md'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-slate-500 mr-2 text-xs shrink-0">{file.path}</span>
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden min-h-[600px]">
          {children}
        </div>
      </main>
    </div>
  );
};
