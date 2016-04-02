import React from 'react';

import Navbar from '../navbar/navbar.jsx';
import CurrentIntervals from '../containers/currentIntervals.jsx';
import PreviousIntervals from '../containers/previousIntervals.jsx';

const Application = () => {
  return (
    <div className="application">
      <Navbar />
      <CurrentIntervals />
      <PreviousIntervals />
    </div>
  );
};

export default Application;
