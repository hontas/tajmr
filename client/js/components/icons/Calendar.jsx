import React from 'react';
import PropTypes from 'prop-types';

/**
 * Created by Gregor Cresnar
 * from the Noun Project
 * title: Artboard 30
 */
const Calendar = ({ className, size = 30 }) => (
  <svg
    style={{ width: size }}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 98 98"
  >
    <path
      d="M89,14H83V9.5a7.5,7.5,0,0,0-15,0V14H32V9.5a7.5,7.5,0,0,0-15,0V14H11a9,9,0,0,0-9,9V89a9,9,0,0,0,9,9H89a9,9,0,0,0,9-9V23A9,9,0,0,0,89,14ZM86,86H14V35H86ZM23,53V47a3,3,0,0,1,3-3h6a3,3,0,0,1,3,3v6a3,3,0,0,1-3,3H26A3,3,0,0,1,23,53Zm21,0V47a3,3,0,0,1,3-3h6a3,3,0,0,1,3,3v6a3,3,0,0,1-3,3H47A3,3,0,0,1,44,53Zm21,0V47a3,3,0,0,1,3-3h6a3,3,0,0,1,3,3v6a3,3,0,0,1-3,3H68A3,3,0,0,1,65,53ZM23,74V68a3,3,0,0,1,3-3h6a3,3,0,0,1,3,3v6a3,3,0,0,1-3,3H26A3,3,0,0,1,23,74Zm21,0V68a3,3,0,0,1,3-3h6a3,3,0,0,1,3,3v6a3,3,0,0,1-3,3H47A3,3,0,0,1,44,74Z"
      fill="currentColor"
    />
  </svg>
);

Calendar.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};

export default Calendar;
