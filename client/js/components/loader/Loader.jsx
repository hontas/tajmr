import * as React from 'react';

import { Wave } from '../spinkit/spinkit.jsx';

const Loader = () => (
  <main className="main">
    <div className="application__init" data-testid="app-init">
      <Wave color="rgba(255,255,255,.75)" size="50px" />
    </div>
  </main>
);

export default Loader;
