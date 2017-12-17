/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import SvgIconHoc from './SvgIconHoc.jsx';

/**
 * Created by iconomania
 * from the Noun Project
 */
const Save = ({ className, size = 30 }) => (
  <svg style={{ width: size }} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="30 25 40 45">
    <path d="M42 31v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V31a1 1 0 0 1 1-1h2.586a1 1 0 0 1 .707.293l7.414 7.414a1 1 0 0 1 .293.707V69a1 1 0 0 1-1 1H31a1 1 0 0 1-1-1V31a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1zm9-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1zM34 47v18a1 1 0 0 0 1 1h30a1 1 0 0 0 1-1V47a1 1 0 0 0-1-1H35a1 1 0 0 0-1 1z" fillRule="evenodd" />
  </svg>
);

Save.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string
};

export default SvgIconHoc(Save);
