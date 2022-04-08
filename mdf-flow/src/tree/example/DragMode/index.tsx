import React, { Fragment, useState, forwardRef, useRef, useEffect } from 'react';
import { Button } from 'antd'
import { INode, ILine, ICanvasProps } from '../../src/DragMode'
import { defaultNodes, defaultEdgs, usableNodes, usableLines } from './mock'
import { DragCanvas as Canvas, registerDragCanvasNodes as registerNodes } from '../../src';
import { registerLines } from '../../src/DragMode/utils';
import styles from './index.css';

const Page = () => {
  const [nodes, setNodes] = useState([])
  const [lines, setLines] = useState([])

  const ref = useRef(null)
  
  const beforeAddNode = (...args: any[]) => {
    // console.log('beforeAddNode')
    console.log(args)
    return true
  }

  const beforeAddConnection = (fromNodeID: string, toNodeId: string, nodeList:INode[], lineList:ILine[], conn: any) => {
    // console.log('beforeAddConnection')
    nodeList.forEach(node => {
      if (node.id === fromNodeID) {
        node.type === 'trigger' && conn.hideOverlay("connectLabel")
      }
    })
    return true
  }
  const beforeDeleteNode = (...args: any[]) => {
    // console.log('beforeDeleteNode')
    console.log(args)
    return true
  }
  const beforeDeleteConnection = (...args: any[]) => {
    // console.log('beforeDeleteConnection')
    console.log(args)
    return true
  }

  const onChange = (nodeList: INode[], lineList: ILine[], actionName: string) => {
  }

  const handleClick = () => {
    const rawData = ref.current.getAllData()
    console.log(rawData)
    // console.log(JSON.stringify(rawData))
  }

  const handleValueChange = () => {
    setLines(defaultEdgs)
    setNodes(defaultNodes)
  }

  const handleValueChangeV2 = () => {
    setLines([
      {
        from: '1',
        to: '2',
        data: {
          label: ''
        }
      },
      {
        from: '2',
        to: '3',
        data: {
          label: ''
        },
      }])
      setNodes(defaultNodes.concat(
        {
        id: '6',
        type: 'end',
        label: '结束节点',
        positionX: 0,
        positionY: 0,
        data: {},
      }))
  }

  return (
    <div
      style={{ height: '100vh', position: 'relative' }}
    >
      <Button onClick={handleClick}>从引用拿值</Button>
      <Button onClick={handleValueChange}>从接口拿到默认值</Button>
      <Button onClick={handleValueChangeV2}>再改变</Button>
      <Canvas
        // key={`${JSON.stringify(nodes)}`}
        className={styles['canvas']}
        registerNodes={usableNodes}
        registerLines={usableLines}
        ref={ref}
        globalVars = {{
          applicationId: 4684,
        }}
        nodes={nodes}
        lines={lines}
        lineColor="#94bff0"
        beforeAddNode={beforeAddNode}
        beforeAddConnection={beforeAddConnection}
        beforeDeleteNode={beforeDeleteNode}
        beforeDeleteConnection={beforeDeleteConnection}
        onChange={onChange}
      />
    </div>
  );
};

export default Page;
