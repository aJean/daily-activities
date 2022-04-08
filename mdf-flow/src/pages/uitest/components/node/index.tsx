import React from 'react';
import classnames from 'classnames';
import { LineX, LineY } from '../line';
import AddOperator from '../operator/add';
import Styles from './node.modules.scss';

/**
 * @file 基础 node
 */

type IProps = {
  style?: React.CSSProperties;
  banch?: boolean;
  end?: boolean;
};

export type INode = {
  id: string;
  name: string;
  type: string;
  branchs?: INode[];
  nexts?: INode[];
};

const Node: React.FC<IProps> = (props) => {
  const { end, style, children } = props;

  return (
    <div className={Styles.wrap}>
      <div className={classnames([Styles.node])} style={style}>
        {children}
      </div>
      {end ? null : (
        <>
          <LineY />
          <AddOperator />
          <LineY />
        </>
      )}
    </div>
  );
};

export default Node;
