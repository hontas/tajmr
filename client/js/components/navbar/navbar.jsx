import React from 'react';
import pkg from '../../../../package.json';

export default () => {
  const floatLeft = { float: 'left' };

  return (
    <div className="navbar">
      <p style={ { float: 'left', margin: 0 } }>{ 'navbar' }</p>
      <nav style={ { display: 'inline' } }>
        <ul style={ { display: 'inline', listStyle: 'none', padding: 0 } }>
          <li style={ floatLeft }>
            <label>
              { 'Notifications' }<input type="checkbox" />
            </label>
          </li>
        </ul>
        <div className="version">{ `v${pkg.version}` }</div>
      </nav>
    </div>
  );
};
