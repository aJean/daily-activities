import React from 'react';
import classnames from 'classnames';

import { INode } from '../../types';
import styles from './index.css';

interface IProps {
  node: INode;
}

const DisplayComponent: React.FC<IProps> = (props) => {
  const { node } = props;
  const { type, name } = node;

  return (
    <div className={classnames([
      styles['default-display-component'],
      ['start', 'end'].includes(type) ? styles['end-point'] : styles['normal'],
    ], {
      [styles.editing]: node.props.isEditing,
      [styles.invalid]: node.props.invalid,
    })}>
      {name}
    </div>
  )
};

export default DisplayComponent;
