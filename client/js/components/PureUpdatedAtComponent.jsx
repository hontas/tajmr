import React from 'react';
import PropTypes from 'prop-types';

class PureUpdatedAtComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (!this.props.updatedAt) return true;

    // console.log('this.props.updatedAt', this.props.updatedAt);
    // console.log('nextProps.updatedAt', nextProps.updatedAt);
    // console.log('should update', this.props.updatedAt !== nextProps.updatedAt);

    return this.props.updatedAt !== nextProps.updatedAt;
  }
}

PureUpdatedAtComponent.propTypes = {
  updatedAt: PropTypes.number.isRequired
};

export default PureUpdatedAtComponent;
