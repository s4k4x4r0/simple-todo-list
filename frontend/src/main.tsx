import React from 'react';
import { createRoot } from 'react-dom/client';

function AppBootstrap() {
  return <div>TODO App</div>;
}

const root = createRoot(document.getElementById('root')!);
root.render(<AppBootstrap />);
