import React from 'react';
import classNames from 'classnames';

// eslint-disable-next-line react/prop-types
const SvgIconHoc = (Svg) => ({ className, size = 30 }) => (
  <Svg
    className={classNames('svg-icon', className)}
    size={size}
  />
);

export default SvgIconHoc;