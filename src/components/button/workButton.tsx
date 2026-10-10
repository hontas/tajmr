import { type MouseEventHandler } from 'react';

import Button from './button.tsx';
import styles from './workButton.module.css';

interface WorkButtonProps {
  activeInterval: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
}

const WorkButton = ({ isLoading = false, activeInterval, onClick, ...props }: WorkButtonProps) => {
  const buttonText = activeInterval ? 'Ta en fika ▐▐' : 'Börja debitera ▶';

  return (
    <Button
      {...props}
      data-testid="work-button"
      theme="primary"
      className={styles.workButton}
      onClick={onClick}
      text={buttonText}
      disabled={isLoading}
    />
  );
};

export default WorkButton;
