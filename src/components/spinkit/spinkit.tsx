import * as React from 'react';
// oxlint-disable-next-line import/no-unassigned-import -- the stylesheet of the components below
import 'spinkit/spinkit.min.css';

interface SpinKitProps {
  className?: string;
  color?: string;
  size?: string;
}

interface SpinKitStyle extends React.CSSProperties {
  '--sk-color': string;
  '--sk-size': string;
}

function spinKitStyle(color: string, size: string): React.CSSProperties {
  const style: SpinKitStyle = { '--sk-color': color, '--sk-size': size };
  return style;
}

export function Wave({ className = '', color = 'currentColor', size = '1em' }: SpinKitProps) {
  return (
    <div className={`sk-wave ${className}`} style={spinKitStyle(color, size)}>
      <div className="sk-wave-rect" />
      <div className="sk-wave-rect" />
      <div className="sk-wave-rect" />
      <div className="sk-wave-rect" />
      <div className="sk-wave-rect" />
    </div>
  );
}

export function Bounce({ className = '', color = 'currentColor', size = '1em' }: SpinKitProps) {
  return (
    <div className={`sk-bounce ${className}`} style={spinKitStyle(color, size)}>
      <div className="sk-bounce-dot" />
      <div className="sk-bounce-dot" />
    </div>
  );
}
