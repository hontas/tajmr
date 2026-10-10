import React from 'react';
import classNames from 'classnames';

import * as SpinKit from '#/components/spinkit/spinkit.tsx';

import styles from './button.module.css';

type ButtonTheme = 'default' | 'primary' | 'accent' | 'secondary' | 'danger' | 'success' | 'link';

interface ButtonProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'type'> {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  text?: string;
  isLoading?: boolean;
  block?: boolean;
  type?: 'button' | 'submit';
  theme?: ButtonTheme;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      text,
      isLoading,
      disabled,
      children,
      type = 'button',
      theme = 'default',
      block,
      ...rest
    },
    ref,
  ) => {
    const classes = classNames(styles.button, styles[theme], { [styles.block]: block }, className);

    return (
      <button ref={ref} {...rest} className={classes} type={type} disabled={disabled}>
        {text}
        {children}
        {isLoading && <SpinKit.Bounce size="15px" />}
      </button>
    );
  },
);

export default Button;
