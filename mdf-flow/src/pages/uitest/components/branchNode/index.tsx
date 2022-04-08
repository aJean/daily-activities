import React from 'react';
import { LineX, LineY } from '@/pages/uitest/components/line';
import ConNode from '@/pages/uitest/components/conNode';
import AddOperator from '../operator/add';
import Style from './style.modules.scss';

/**
 * @file 分支节点
 */

type IProps = {
  style?: React.CSSProperties;
  banch?: boolean;
};

const BranchNode: React.FC<IProps> = (props) => {
  const { banch = false, style, children } = props;

  return (
    <div className={Style.wrap}>
      <LineX />
      <div className={Style.inner}>
        <ConNode needClean="Left">流程1</ConNode>
        <ConNode needClean="Right">流程2</ConNode>
      </div>
      <LineX />
      <LineY />
      <AddOperator />
      <LineY />
    </div>
  );
};

export default BranchNode;
