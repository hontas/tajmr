import { type ComponentProps } from 'react';
import classNames from 'classnames';

import * as SpinKit from '#/components/spinkit/spinkit.tsx';

import styles from './button.module.css';

type ButtonTheme = 'default' | 'primary' | 'accent' | 'secondary' | 'danger' | 'success' | 'link';

interface ButtonProps extends Omit<ComponentProps<'button'>, 'type'> {
  text?: string;
  isLoading?: boolean;
  block?: boolean;
  type?: 'button' | 'submit';
  theme?: ButtonTheme;
}

const Button = ({
  className,
  text,
  isLoading,
  disabled,
  children,
  type = 'button',
  theme = 'default',
  block,
  ...rest
}: ButtonProps) => {
  const classes = classNames(styles.button, styles[theme], { [styles.block]: block }, className);

  return (
    <button {...rest} className={classes} type={type} disabled={disabled}>
      {text}
      {children}
      {isLoading && <SpinKit.Bounce size="15px" />}
    </button>
  );
};

export default Button;
