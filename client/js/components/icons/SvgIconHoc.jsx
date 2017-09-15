import React from 'react';
import classNames from 'classnames';

export default (Svg) => ({ className, size=30 }) => (
  <Svg className={ classNames('svg-icon', className) } size={ size } />
);
