import React from 'react';
import getDisplayName from './getDisplayName';

export const thirtySeconds = 1000 * 30;

export default function renderEvery(interval) {
  if (!interval || typeof interval !== 'number')
    throw Error('Argument for render interval must be number');

  return (Component) => {
    class RenderEvery extends React.Component {
      componentDidMount() {
        this.intervalId = setInterval(() => {
          this.forceUpdate();
        }, interval);
      }

      componentWillUnmount() {
        clearInterval(this.intervalId);
      }

      render() {
        return <Component {...this.props} />;
      }
    }

    RenderEvery.getDisplayName = getDisplayName(Component);

    return RenderEvery;
  };
}
