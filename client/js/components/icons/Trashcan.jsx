/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import SvgIconHoc from './SvgIconHoc.jsx';

/**
 * Created by iconomania
 * from the Noun Project
 */
const Trashcan = ({ className, size = 30 }) => (
  <svg style={{ width: size }} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 98">
    <path d="M52.796,27l-0.963,55.667h10.001L62.797,27H52.796z M46.21,27H36.209l0.963,55.667h10.001L46.21,27z M69.399,87.95  l-0.003,0.161c0,0.316-0.255,0.573-0.567,0.573H30.18c-0.316,0-0.573-0.257-0.573-0.573L27.642,27H17.638l1.969,61.204  c0.051,5.788,4.774,10.48,10.573,10.48h38.649c5.796,0,10.518-4.693,10.567-10.481L81.365,27H71.361L69.399,87.95z M67.854,10.972  l-2-9.655h-32.7l-2,9.655H11.48v10H88.52v-10H67.854z" />
  </svg>
);

Trashcan.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string
};

export default SvgIconHoc(Trashcan);
