import * as React from 'react';

import Button from './button/button.tsx';

interface ErrorBoundaryFallbackProps {
  error: unknown;
  componentStack: string;
  resetError: () => void;
}

export const ErrorBoundaryFallback = ({
  error,
  componentStack,
  resetError,
}: ErrorBoundaryFallbackProps) => (
  <div style={{ padding: '1em', backgroundColor: 'rgba(0,0,0,0.2)' }}>
    <h1>Oh noes 😱</h1>
    <pre>
      <code>{String(error)}</code>
      <code>{componentStack}</code>
    </pre>
    <Button onClick={() => resetError()} text="Reset error" />
  </div>
);
