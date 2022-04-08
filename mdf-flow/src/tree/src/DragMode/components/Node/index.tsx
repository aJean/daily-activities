import React, { useEffect, useState } from 'react';
import { INode, ICurrentChosenData } from '../../types'
import deleteIcon from '../../icons/delete.svg';
import { getRegisteredNodesByType } from '../../utils'
import { setTargetAndSourceFilter } from '../Canvas/settings'
import DefaultNodeDisplay from './DefaultNodeDisplay'
import styles from './index.css';

interface IProps {
  data: INode;
  globalVars: any;
  handleDelete: (nodeId: string) => void;
  handleClick: (data: ICurrentChosenData) => void;
  initNode:  (node: INode) => void;
  refreshCanvas: () => void;
  setDrawerVisible: (bool: boolean) => void;
}

const Node: React.FC<IProps> = (props) => {
  const {
    data,
    handleDelete,
    initNode,
    handleClick,
    refreshCanvas,
    setDrawerVisible,
    globalVars,
  } = props;
  const {
    type,
    id,
    positionX,
    positionY,
  } = data;
  const [deleteVisible, setDeleteVisible] = useState(false)

  useEffect(() => {
    const registeredNode = getRegisteredNodesByType(type)
    // 设置classFilter
    registeredNode && setTargetAndSourceFilter(registeredNode.classFilter || '.flow-node-drag')
    initNode(data)
  }, [])

  const handleMouseEnter = (e: any) => {
    setDeleteVisible(true)
  }
  
  const handleMouseLeave = (e: any) => {
    setDeleteVisible(false)
  }

  const handleDeleteIconClick = (e: any) => {
    handleDelete(id)
  }

  const handleNodeClick = (e: any) => {
    handleClick({
      type: 'node',
      info: data,
    })
    setDrawerVisible(true)
  }

  const dispatchComponent =  () => {
    const registeredNode = getRegisteredNodesByType(type)
    const Component = registeredNode?.displayComponent || DefaultNodeDisplay
    return (
      <Component
        data={data}
        globalVars={globalVars}
        handleDelete={handleDelete}
        refreshCanvas={refreshCanvas}
      />
    )
  }

  return (
    <div
      id={id}
      className={styles['node-component']}
      style={{ left: positionX , top: positionY}}
      onDoubleClick={handleNodeClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {dispatchComponent()}
      {
        deleteVisible && (
          <div
            className={styles['delete-icon']}
            onClick={handleDeleteIconClick}
          >
            {deleteIcon && <img src={deleteIcon} />}
            {/* <CloseCircleTwoTone twoToneColor="#eb2f96"/> */}
          </div>
          )
      }
    </div>
  )
};

export default Node;
