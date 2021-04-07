import * as React from 'react';
import * as Sentry from '@sentry/browser';

import * as customPropTypes from '../constants/propTypes';

export class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  state = { hasError: false, error: '' };

  componentDidCatch(error) {
    Sentry.captureException(new Error(error));
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div>
          <h1>Something went wrong 🤷</h1>
          <pre>
            <code>{error.toString()}</code>
          </pre>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: customPropTypes.children,
};
