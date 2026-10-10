import * as React from 'react';
import PropTypes from 'prop-types';

import Button from './button/button.jsx';

export const ErrorBoundaryFallback = ({ error, componentStack, resetError }) => (
  <div style={{ padding: '1em', backgroundColor: 'rgba(0,0,0,0.2)' }}>
    <h1>Oh noes 😱</h1>
    <pre>
      <code>{error.toString()}</code>
      <code>{componentStack}</code>
    </pre>
    <Button onClick={() => resetError()} text="Reset error" />
  </div>
);

ErrorBoundaryFallback.propTypes = {
  error: PropTypes.shape({}),
  componentStack: PropTypes.string,
  resetError: PropTypes.func.isRequired,
};
