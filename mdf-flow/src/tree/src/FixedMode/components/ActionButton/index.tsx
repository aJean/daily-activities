import React from 'react';

import AddButtonIcon from '../../icons/add-button.svg';
import styles from './index.css';

interface IProps {
  size?: number;
  icon?: string;
}

const ActionButton: React.FC<IProps> = (props) => {
  const { size=28, icon=AddButtonIcon } = props;

  return (
    <div
      className={styles['action-button']}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size / 2}px`,
      }}
    >
      <img src={icon} />
    </div>
  )
};

export default ActionButton;
