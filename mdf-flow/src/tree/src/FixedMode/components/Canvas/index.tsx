import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Drawer, Button } from 'antd';
import classnames from 'classnames';
import SetterForm from '../SetterForm';

import NodeItem from '../NodeItem';
import NodeWrap from '../NodeWrap';
import { LineX, LineY } from '../Line';
import DefaultDisplayComponent from '../DisplayComponent';
import { Context } from '../../contexts';

import {
  DEFAULT_BG_COLOR, DEFAULT_LINE_COLOR,
  DEFAULT_SPACE_X, DEFAULT_SPACE_Y,
} from '../../constants';
import { IRegisterNode, INode, IRefFormMethod } from '../../types';
import {
  getDisplayNodeByType, isBranchNode,
  createNewNodeData, addNode, removeNode,
  getHorizontalClassName, getRegisterNode,
} from '../../utils';

import styles from './index.css';

/**
 * @file dom 画布
 */

interface IProps {
  registerNodes?: IRegisterNode[];
  data: INode[];
  onChange: (data: INode[]) => void;
  backgroundColor?: string;
  lineColor?: string;
  spaceX?: number;
  spaceY?: number;
  horizontalLayout?: boolean;
  showScale?: boolean;
  drawerConfig?: any;
  className?: string;
  popupOnBody?: boolean;
}

const Canvas: React.FC<IProps> = (props) => {
  const {
    registerNodes=[],
    data=[],
    onChange,
    backgroundColor=DEFAULT_BG_COLOR,
    lineColor=DEFAULT_LINE_COLOR,
    spaceX=DEFAULT_SPACE_X,
    spaceY=DEFAULT_SPACE_Y,
    horizontalLayout=false,
    drawerConfig={},
    showScale=false,
    className='',
    popupOnBody=true,
  } = props;

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentNode, setCurrentNode] = useState<INode|null>();
  const [scale, setScale] = useState<number>(100);

  const formRef = useRef<IRefFormMethod>(null);

  const canvasData = useMemo(() => {
    if (data.length === 0) {
      return [
        // 从注册的节点中创建相应的类型
        createNewNodeData(registerNodes, 'start'),
        createNewNodeData(registerNodes, 'end'),
      ];
    }
    return [...data];
  }, [data, registerNodes]);

  const renderCurrentConfigForm = useCallback(() => {
    if (!currentNode) return;

    const registerNode = getRegisterNode(registerNodes, currentNode.type);

    if (registerNode?.customConfigComponent) {
      const Component = registerNode.customConfigComponent;
      return (
        <Component
          ref={formRef}
          defaultValue={currentNode.data}
          node={currentNode}
        />
      );
    } else if (registerNode?.setterConfig) {
      return (
        <SetterForm
          ref={formRef}
          setterConfig={registerNode.setterConfig}
          defaultValue={currentNode.data}
        />
      );
    }

    return;
  }, [currentNode]);

  const handleNodeClick = (targetNode: INode, actionType: string, newNodeType?: string) => {
    if (actionType === 'addNode') {
      // 修改 canvasData
      addNode(registerNodes, targetNode, createNewNodeData(registerNodes, newNodeType), canvasData);
      // 执行 setData
      onChange([...canvasData]);
    } else if (actionType === 'removeNode') {
      removeNode(targetNode, canvasData);
      onChange([...canvasData]);
    } else if (actionType === 'configNode') {
      targetNode.props.isEditing = true;

      setCurrentNode(targetNode);
      setDrawerVisible(true);

      onChange([...canvasData]);
    }
  };

  const updateNodeValues = (values: any) => {
    if (currentNode) {
      const validator = getRegisterNode(registerNodes, currentNode.type)?.validator;
      currentNode.data = values;
      currentNode.props.isEditing = false;
      if (validator) {
        currentNode.props.invalid = !validator(currentNode);
      }
    }
    setDrawerVisible(false);
    setCurrentNode(null);
    onChange([...canvasData]);
  };

  const handleDrawerSave = async () => {
    try {
      const values = await formRef.current?.validateFields();
      updateNodeValues(values);
    } catch (error) {
    }
  };

  const handleDrawerClose = () => {
    const values = formRef.current?.getFieldsValue();
    updateNodeValues(values);
  };

  const handleSmallScale = () => {
    setScale(scale - 10);
  };

  const handleBigScale = () => {
    setScale(scale + 10);
  };

  const renderFlexLine = (horizontal: boolean) => !horizontal ? <LineY full /> : <LineX full />;
    
  const renderClearLine = (horizontal: boolean) => !horizontal ? <LineX height={4} full color={backgroundColor} /> : <LineY width={4} full color={backgroundColor} />;

  /**
   * 画分支 ui
   */
  const renderBranch = (branchs: INode[]) => {
    return (
      <Context.Consumer>
        {value =>
          <NodeItem layout={getHorizontalClassName(!value.horizontalLayout)} banch>
            <>
              <div className={`${styles['branch-dashed-wrap']} ${branchs.length !== 1 ? styles.hide : ''}`}>
                <div
                  className={`${styles['branch-dashed']} ${styles['branch-dashed-left']}`}
                  style={{ borderColor: DEFAULT_LINE_COLOR }}
                />
                <div
                  className={`${styles['branch-dashed']} ${styles['branch-dashed-right']}`}
                  style={{ borderColor: DEFAULT_LINE_COLOR }}
                />
                <div
                  className={`${styles['branch-dashed']} ${styles['branch-dashed-top']}`}
                  style={{ borderColor: DEFAULT_LINE_COLOR }}
                />
                <div
                  className={`${styles['branch-dashed']} ${styles['branch-dashed-bottom']}`}
                  style={{ borderColor: DEFAULT_LINE_COLOR }}
                />
              </div>
              {branchs.map((node, index) =>
                <NodeItem
                  key={node.id}
                  layout={getHorizontalClassName(value.horizontalLayout)}
                  style={
                    !value.horizontalLayout ?
                    { padding: `0 ${spaceX}px` } :
                    { padding: `${spaceY}px 0` }
                  }
                >
    
                  {/* 清除多余的线 */}
                  {index === 0 && (
                    <div
                      className={classnames([
                        styles.line__clear,
                        styles.top,
                        styles.left,
                      ])}
                    >
                      {renderClearLine(value.horizontalLayout)}
                    </div>
                  )}
                  {index === branchs.length - 1 && (
                    <div
                      className={classnames([
                        styles.line__clear,
                        !value.horizontalLayout ? styles.top : styles.bottom,
                        !value.horizontalLayout ? styles.right : styles.left,
                      ])}
                    >
                      {renderClearLine(value.horizontalLayout)}
                    </div>
                  )}
                  
                  {/* 渲染条件节点 */}
                  {renderNode(node)}

                  {/* 补充高度 */}
                  <div className={styles.line__flex}>
                    {renderFlexLine(value.horizontalLayout)}
                  </div>
    
                  {/* 清除多余的线 */}
                  {index === 0 && (
                    <div
                      className={classnames([
                        styles.line__clear,
                        !value.horizontalLayout ? styles.bottom : styles.top,
                        !value.horizontalLayout ? styles.left : styles.right,
                      ])}
                    >
                      {renderClearLine(value.horizontalLayout)}
                    </div>
                  )}
                  {index === branchs.length - 1 && (
                    <div
                      className={classnames([
                        styles.line__clear,
                        styles.bottom,
                        styles.right,
                      ])}
                    >
                      {renderClearLine(value.horizontalLayout)}
                    </div>
                  )}
                </NodeItem>
              )}
            </>
          </NodeItem>
        }
      </Context.Consumer>
    );
  };

  /**
   * 渲染 ui 节点，有 branchs 就画分支，有 next 就继续递归
   */
  const renderNode = (node: INode) => {
    const { id, type, branchs=[], next=[] } = node;
    const Component = getDisplayNodeByType(registerNodes, type) || DefaultDisplayComponent;
    const validator = getRegisterNode(registerNodes, type)?.validator;

    validator && (node.props.invalid = !validator(node));

    return (
      <Context.Consumer key={id}>
        {value =>
          <NodeItem layout={getHorizontalClassName(value.horizontalLayout)} banch={isBranchNode(registerNodes, type)}>
            <NodeWrap registerNodes={registerNodes} node={node} onClick={handleNodeClick}>
              {
                isBranchNode(registerNodes, type) ?
                renderBranch(branchs) :
                <Component node={node} />
              }
            </NodeWrap>
            {render(next)}
          </NodeItem>
        }
      </Context.Consumer>
    );
  };

  /**
   * 渲染入口
   */
  const render = (nodes: INode[]) => nodes.map(node => renderNode(node));


  return (
    <>
      <Context.Provider value={{ backgroundColor, lineColor, spaceX, spaceY, horizontalLayout, popupOnBody }}>
        <div className={styles['canvas-wrap']}>
          <div className={`${styles.canvas} ${className}`} style={{ backgroundColor }}>
            {showScale ?
              <div className={styles.scale}>
                <Button disabled={scale === 10} onClick={handleSmallScale}>-</Button>
                <span className={styles.number}>{`${scale}%`}</span>
                <Button onClick={handleBigScale}>+</Button>
              </div> :
              null
            }
            <div
              className={classnames([
                styles.editor,
                styles[getHorizontalClassName(horizontalLayout)],
              ])}
              style={
                Object.assign({ backgroundColor }, popupOnBody ? {
                  transform: `scale(${scale/100})`,
                  transformOrigin: `${scale > 100 ? 0 : '50%'} 0`,
                } : {
                  zoom: `${scale/100}`
                })
              }
            >
              {render(canvasData)}
            </div>
          </div>
        </div>
      </Context.Provider>
      <Drawer
        title='节点配置'
        visible={drawerVisible}
        onClose={handleDrawerClose}
        destroyOnClose
        getContainer={false}
        drawerStyle={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}
        bodyStyle={{ marginBottom: '53px', flex: 1, overflow: 'auto' }}
        {...drawerConfig}
      >
        {renderCurrentConfigForm()}
        <div className={styles['drawer-footer']}>
          <Button style={{ marginRight: 8 }} onClick={() => setDrawerVisible(false)}>取消</Button>
          <Button type='primary' onClick={handleDrawerSave}>确定</Button>
        </div>
      </Drawer>
    </>
  )
};

export default Canvas;
