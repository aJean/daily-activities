import React from 'react';
import classnames from 'classnames';
import { INode } from '../../../../src/FixedMode';

import styles from './index.css';

interface IProps {
  node: INode;
}

const Condition: React.FC<IProps> = (props) => {
  const { node } = props;

  return (
    <div className={classnames({
      [styles.condition]: true,
      [styles.editing]: node.props.isEditing,
      [styles.invalid]: node.props.invalid,
    })}>{node.name}</div>
  )
};

export default Condition;
