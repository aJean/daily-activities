import React from 'react';
import classnames from 'classnames';
import AddOperator from '../operator/add';
import Style from './style.modules.scss';
import { LineY } from '@/pages/uitest/components/line';

/**
 * @file 流程 node
 */

type IProps = {
  style?: React.CSSProperties;
  needClean?: String;
  banch?: boolean;
  next?: any[];
};

const Node: React.FC<IProps> = (props) => {
  const { needClean = false, style, children, next = [] } = props;

  return (
    <div className={Style.wrap}>
      <LineY />
      <div className={classnames([Style.node])} style={style}>
        {children}
      </div>
      <LineY />
      <AddOperator />
      <LineY />
      {/* 清除边界线 */}
      {needClean ? <div className={classnames([Style.cleanUp, Style[`clean${needClean}`]])}></div> : null}
      {needClean ? <div className={classnames([Style.cleanDown, Style[`clean${needClean}`]])}></div> : null}
    </div>
  );
};

export default Node;
