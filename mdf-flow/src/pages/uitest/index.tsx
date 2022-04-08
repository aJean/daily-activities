import { FC, useEffect } from 'react';
import { RouteComponentProps } from '@ies/ace';
import Style from './index.modules.scss';
import Node, { INode } from './components/node';
import BranchNode from './components/branchNode';

/**
 * @file 固定流程画布
 */

const nodeList = [{ }]

const Canvas: FC<RouteComponentProps> = () => {
  useEffect(() => {}, []);

  const renderNode = (node: INode) => {
    const { id, type, branchs = [], nexts = [] } = node;
    // 节点类型
    const Component = type == 'branch' ? BranchNode : Node;

    return <Component>{render(nexts)}</Component>;
  };

  const render = (nodes: INode[]) => nodes.map((node) => renderNode(node));

  return (
    <div className={Style.canvas}>
      <Node>开始</Node>
      <BranchNode />
      <Node end={true}>结束</Node>
    </div>
  );
};

export default Canvas;
