import React from 'react';
import PropTypes from 'prop-types';

class PureUpdatedAtComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (!this.props.updatedAt || !nextProps.updatedAt) return true;

    console.log('this.displayName', this.displayName);
    console.log('should update', this.props.updatedAt !== nextProps.updatedAt);
    console.log('nextProps.intervals.length', nextProps.intervals.length);
    //return this.props.updatedAt !== nextProps.updatedAt;
    return true;
  }
}

PureUpdatedAtComponent.propTypes = {
  updatedAt: PropTypes.number.isRequired
};

export default PureUpdatedAtComponent;
