import { useState } from 'react';
import { DocsLayout } from './components/DocsLayout';
import { IndexDoc } from './docs/IndexDoc';
import { WsServerDoc } from './docs/WsServerDoc';
import { DbSchemaDoc } from './docs/DbSchemaDoc';
import { DbConnDoc } from './docs/DbConnDoc';
import { RoutesMatchesDoc } from './docs/RoutesMatchesDoc';
import { RoutesCommentaryDoc } from './docs/RoutesCommentaryDoc';
import { ArcjetDoc } from './docs/ArcjetDoc';
import { SeedDoc } from './docs/SeedDoc';
import { UtilsStatusDoc } from './docs/UtilsStatusDoc';
import { ValMatchesDoc } from './docs/ValMatchesDoc';
import { ValCommentaryDoc } from './docs/ValCommentaryDoc';

function App() {
  const [activeId, setActiveId] = useState('index');

  const renderContent = () => {
    switch (activeId) {
      case 'index': return <IndexDoc />;
      case 'ws_server': return <WsServerDoc />;
      case 'db_schema': return <DbSchemaDoc />;
      case 'db_conn': return <DbConnDoc />;
      case 'routes_matches': return <RoutesMatchesDoc />;
      case 'routes_commentary': return <RoutesCommentaryDoc />;
      case 'arcjet': return <ArcjetDoc />;
      case 'seed': return <SeedDoc />;
      case 'utils_status': return <UtilsStatusDoc />;
      case 'val_matches': return <ValMatchesDoc />;
      case 'val_commentary': return <ValCommentaryDoc />;
      default: return <IndexDoc />;
    }
  };

  return (
    <DocsLayout activeId={activeId} onNavigate={setActiveId}>
      {renderContent()}
    </DocsLayout>
  );
}

export default App;
