import React from 'react';
import classnames from 'classnames';

import styles from './index.css';

type layout = 'vertical' | 'horizontal';

interface IProps {
  layout?: layout;
  style?: React.CSSProperties;
  banch?: boolean;
}

const NodeItem: React.FC<IProps> = (props) => {
  const { layout='vertical', banch=false, style, children } = props;

  return (
    <div
      className={classnames([
        styles['node-item'],
        styles[layout],
        styles[banch ? 'branch-content' : ''],
      ])}
      style={style}
    >
      {children}
    </div>
  )
};

export default NodeItem;
