import React from 'react';
import TimerMixin from 'react-timer-mixin';

import store from '../store/store';
import constants from '../constants';
import Header from './header.jsx';
import DigitalClock from './digitalClock.jsx';
import Button from './button.jsx';
import IntervalList from './intervalList.jsx';

function isToday({ startedWorkingAt }) {
  const today = new Date();
  const date = new Date(startedWorkingAt);

  return date.toLocaleDateString() === today.toLocaleDateString();
}

export default React.createClass({
  mixins: [TimerMixin],

  getInitialState() {
    return {
      intervals: store.getIntervals(),
      currentInterval: store.getCurrentInterval()
    };
  },

  componentDidMount() {
    store.addChangeListener(this.onStoreChange);
    this.toggleIntervalRender = (() => {
      let intervalId;
      return () => {
        if (intervalId) {
          this.clearInterval(intervalId);
          intervalId = null;
        } else {
          intervalId = this.setInterval(this.forceUpdate, 1000);
        }
      };
    })();

    if (this.state.currentInterval) {
      this.toggleIntervalRender();
    }
  },

  componentWillUnmount() {
    store.removeChangeListener(this.onStoreChange);
  },

  render() {
    const { intervals, currentInterval } = this.state;
    const intervalSum = intervals
      .filter(isToday)
      .filter((interval) => interval.stoppedWorkingAt)
      .map((interval) => interval.stoppedWorkingAt - interval.startedWorkingAt)
      .reduce((sum, curr) => (sum + curr), 0);

    const elapsedTime = currentInterval ? intervalSum + Date.now() - currentInterval.startedWorkingAt : intervalSum;
    const buttonText = currentInterval ? 'Take a break ▐▐' : 'Start workin\' ▶';

    return (
      <div className="application">
        <Header />
        <DigitalClock time={ elapsedTime } />
        <Button onClick={ this.onClick } text={ buttonText } />
        <IntervalList intervals={ intervals }/>
      </div>
    );
  },

  onStoreChange() {
    this.setState({
      intervals: store.getIntervals(),
      currentInterval: store.getCurrentInterval()
    });
  },

  onClick() {
    if (this.state.currentInterval) {
      this.takeABreak();
    } else {
      this.startWorking();
    }
  },

  startWorking() {
    this.toggleIntervalRender();
    store.startedWorking(Date.now());
  },

  takeABreak() {
    const { currentInterval: { id } } = this.state;
    this.toggleIntervalRender();

    store.stoppedWorking({
      timestamp: Date.now(),
      intervalId: id
    });
  }
});
