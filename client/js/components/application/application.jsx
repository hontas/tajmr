import React from 'react';

import Navbar from '../navbar/navbar.jsx';
import CurrentIntervals from '../containers/currentIntervals.jsx';
import PreviousIntervals from '../containers/previousIntervals.jsx';
import Footer from '../footer/footer.jsx';

const Application = () => {
  return (
    <div className="application">
      <Navbar />
      <CurrentIntervals />
      <PreviousIntervals />
      <Footer />
    </div>
  );
};

export default Application;
