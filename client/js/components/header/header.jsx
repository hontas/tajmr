import React from 'react';
import pkg from '../../../../package.json';

export default () => {
  return (
    <header className="header">
      <h1>{ 'TimR' }</h1>
      <div className="version">{ pkg.version }</div>
    </header>
  );
};
