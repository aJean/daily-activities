import React, { useState, useMemo } from 'react';
import { Popover, Popconfirm } from 'antd';
import classnames from 'classnames';
import NodeItem from '../NodeItem';
import { LineX, LineY } from '../Line';
import ActionButton from '../ActionButton';
import { Context } from '../../contexts';

import {
  getAddableNodeList, getRegisterNode,
  isBranchNode, isConditionNode, getHorizontalClassName,
} from '../../utils';
import { IRegisterNode, INode } from '../../types';

import DefaultAddBranchIcon from '../../icons/add-branch.svg';
import DefaultAddApprovalIcon from '../../icons/add-approval.svg';
import DefaultAddConditionIcon from '../../icons/add-condition.svg';
import CloseIcon from '../../icons/close-one.svg';
import styles from './index.css';

interface IProps {
  registerNodes?: IRegisterNode[];
  node: INode;
  onClick: (currentNode: INode, actionType: string, newNodeType?: string) => void;
} 

const NodeWrap: React.FC<IProps> = (props) => {
  const { registerNodes=[], node, onClick, children } = props;
  const { type, branchs=[] } = node;

  const [visible, setVisible] = useState(false);

  const currentRegisterNode = useMemo(
    () => getRegisterNode(registerNodes, node.type),
    []
  );

  const isVirtualNode = isBranchNode(registerNodes, type);
  const isConfigurableNode = !isVirtualNode && currentRegisterNode?.props?.configurable;

  const handleAddNodeClick = (e: React.MouseEvent, registerNode: IRegisterNode) => {
    e.stopPropagation();
    setVisible(false);
    // node 原始数据，传给 canvas handleNodeClick
    onClick(node, 'addNode', registerNode.type);
  };

  const handleAddConditionNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(node, 'addNode', currentRegisterNode?.condition?.type);
  };

  const handleRemoveNodeClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onClick(node, 'removeNode');
  };

  const handleConfigNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConfigurableNode) {
      onClick(node, 'configNode');
    }
  };

  const renderNodeOptions = () => (getAddableNodeList(registerNodes) || []).map((addableNode, index) => {
    let icon = addableNode?.props?.icon;
    if (!icon) {
      icon = isBranchNode(registerNodes, addableNode.type) ? DefaultAddBranchIcon : DefaultAddApprovalIcon;
    }

    return (
      <div key={index} className={styles.option} onClick={e => handleAddNodeClick(e, addableNode)}>
        {icon && <img className={styles.icon} src={icon} />}
        {addableNode.name}
      </div>
    )
  });

  const shouldRenderBranchNode = isBranchNode(registerNodes, type) && branchs.length > 0;

  const renderBranchLine = (horizontal: boolean) => shouldRenderBranchNode &&
    (!horizontal ?
      <LineX full /> :
      <LineY full />);

  return (
    <Context.Consumer>
      {value =>
        <NodeItem
          layout={getHorizontalClassName(value.horizontalLayout)}
          style={
            !value.horizontalLayout ?
            { marginTop: shouldRenderBranchNode ? '10px' : '' } :
            { marginLeft: shouldRenderBranchNode ? '10px' : '' }
          }
        >
          {/* 分支节点，最上面有一条线 */}
          {renderBranchLine(value.horizontalLayout)}

          {/* 增加分支 */}
          {shouldRenderBranchNode && (
            <div
              className={classnames([
                styles['add-condition-button'],
                styles[getHorizontalClassName(value.horizontalLayout)],
              ])}
              onClick={handleAddConditionNodeClick}
            >
              <ActionButton size={20} icon={DefaultAddConditionIcon} />
            </div>
          )}
    
          {/* 条件节点，框框上面多一条竖线 */}
          {isConditionNode(registerNodes, type) && (!value.horizontalLayout ? <LineY /> : <LineX />)}
    
          {/* 节点内容 */}
          <div
            className={classnames({
              [styles.node]: true,
              [styles.virtual]: isVirtualNode,
            })}
            onClick={handleConfigNodeClick}
          >
            {children}
            {!['start', 'end'].includes(type) &&!isBranchNode(registerNodes, type) &&
              <Popconfirm
                title="确定删除节点吗？"
                okText="确定"
                cancelText="取消"
                getPopupContainer={triggerNode => value.popupOnBody ? window.document.body : triggerNode.parentNode as HTMLElement}
                onCancel={e => e?.stopPropagation()}
                onConfirm={handleRemoveNodeClick}
              >
                <img className={styles.remove} onClick={e => e.stopPropagation()} src={CloseIcon} />
              </Popconfirm>
            }
          </div>
    
          {/* 分支节点，最下面有一条线 */}
          {renderBranchLine(value.horizontalLayout)}
    
          {/* 节点下方的添加按钮 */}
          {type !== 'end' &&
            <>
              {!value.horizontalLayout ? <LineY /> : <LineX />}
              <Popover
                visible={visible}
                getPopupContainer={triggerNode => value.popupOnBody ? window.document.body : triggerNode.parentNode as HTMLElement}
                placement="rightTop"
                trigger="click"
                content={renderNodeOptions()}
                onVisibleChange={visible => setVisible(visible)}
              >
                <div>
                  <ActionButton />
                </div>
              </Popover>
              {!value.horizontalLayout ? <LineY /> : <LineX />}
            </>
          }
        </NodeItem>
      }
    </Context.Consumer>
  );
};

export default NodeWrap;
