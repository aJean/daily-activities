import React, { useState, useEffect, useCallback, useImperativeHandle, useRef } from 'react';
import Node from '../Node';
import Panel from '../Panel';
import SetterForm from '../SetterForm'
import { jsPlumb } from 'jsplumb';
import { Drawer, Button, Empty } from 'antd';
import {
  getSettings,
  getJsplumbSourceOptions,
  getJsplumbTargetOptions,
  getJsplumbConnectOptions,
  setPaintStyleSetting,
} from './settings';
import {
  ICanvasExposeProps,
  INode,
  ILine,
  ICanvasProps,
  ICurrentChosenData,
  ITempData,
  IRefFormMethod
} from '../../types'
import {
  getMin,
  getRegisteredNodes,
  getRegisteredLines,
  getRegisteredNodesByType
} from '../../utils'
import zoomInIcon from '../../icons/zoom-in.svg'
import zoomOutIcon from '../../icons/zoom-out.svg'
import styles from './index.css';

const defaultScale = {
  initialValue: 1,
  maxValue: 5,
  minValue: 1,
  stepValue: 0.5,
};
const Canvas = React.forwardRef<ICanvasExposeProps, ICanvasProps>((props, ref) => {
  const {
    nodes: defaultNodes,
    lines: defaultLines,
    lineColor,
    globalVars,
    beforeAddNode,
    beforeAddConnection,
    beforeDeleteNode,
    beforeDeleteConnection,
    onChange,
    className,
    panelClassName,
    canvasClassName,
    scale,
  } = props
  const currentScale = { ...defaultScale, ...scale };

  // 注册实例
  const [jsPlumbInstance] = useState(jsPlumb.getInstance())
  const formRef = useRef<IRefFormMethod>(null)
  const [nodes, setNodes] = useState(defaultNodes);
  const [edgs, setEdgs] = useState(defaultLines);
  const [currentChosen, setCurrentChosen] = useState<ICurrentChosenData>()
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [canvasScale, setCanvasScale] = useState(currentScale.initialValue);

  // 暴露方法 拿到所有数据
  useImperativeHandle(ref, () => ({
    getAllData: () => ({ nodes, edgs })
  }))

  // 初始化
  useEffect(() => {
    jsPlumbInstance.ready(() => {
      // jsPlumbInstance.setContainer("container");
      jsPlumbInstance.setSuspendDrawing(false, true)
      setPaintStyleSetting(lineColor)
      jsPlumbInstance.importDefaults(getSettings())
      renderInitEdgs(edgs)
    })
    return () => {
      jsPlumbInstance.clear()
    }
  }, [])

  // hooks 快照原因，事件要拿到最新的值
  useEffect(() => {
    jsPlumbInstance.bind('beforeDrop', (event, originalEvent) => {
      const from = event.sourceId
      const to = event.targetId
      const conn = event.connection
      // 钩子
      return !beforeAddConnection || beforeAddConnection(from, to, nodes, edgs, conn)
    })

    jsPlumbInstance.bind('connection', (event, originalEvent) => {
      if (originalEvent) {
        const newEdgs = {
          from: event.sourceId,
          to: event.targetId,
          data: {
            label: '',
          },
        }
        setEdgs([...edgs, newEdgs])
        onChange && onChange(nodes, [...edgs, newEdgs], 'addConnection')
      }
    })

    jsPlumbInstance.bind('click', function (conn, originalEvent) {
      const from = String(conn.sourceId)
      const to = String(conn.targetId)
      const temp: any = edgs.find(edg => edg.from === from && edg.to === to) || {}
      const targetEdg: ITempData = Object.assign(temp, { conn })
      setCurrentChosen({
        type: 'line',
        info: targetEdg
      })
      setDrawerVisible(true)
    })

    jsPlumbInstance.bind('contextmenu', function(conn, originalEvent) {
      const from = String(conn.sourceId)
      const to = String(conn.targetId)
      const line = {
        from,
        to,
      }
      // 钩子
      if (!beforeDeleteConnection || beforeDeleteConnection(line, nodes, edgs)) {
        const newEdgs = [...edgs].filter(item => item.from !== from || item.to !== to)
        jsPlumbInstance.deleteConnection(conn)
        setEdgs(newEdgs)
        onChange && onChange(nodes, newEdgs, 'deleteConnection')
      }
      originalEvent.preventDefault();
    })
    return (() => {
      jsPlumbInstance.unbind('beforeDrop')
      jsPlumbInstance.unbind('connection')
      jsPlumbInstance.unbind('click')
      jsPlumbInstance.unbind('contextmenu')
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edgs, nodes])

  const refreshCanvas = () => {
    jsPlumbInstance.setSuspendDrawing(false, true)
  }
  
  const renderInitEdgs = (edgs: ILine[]) => {
    for (const edg of edgs) {
      const connParam = {
        source: edg.from,
        target: edg.to,
      }
      const conn = jsPlumbInstance.connect(connParam, getJsplumbConnectOptions())
      const labelOverlay = conn.getOverlay("connectLabel")
      const { data = {} } = edg || {}
      labelOverlay?.setLabel(data?.label || '+')
    }
  }

  const handleDragStart = useCallback((e: any, type: string) => {
    const { dataTransfer, clientX, clientY } = e;
    dataTransfer.setData('type', type);
    dataTransfer.setData('startX', clientX);
    dataTransfer.setData('startY', clientY);
  }, [])
  
  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    const { dataTransfer, clientX: endX, clientY: endY } = e;
    const type = dataTransfer.getData('type');
    const startX = dataTransfer.getData('startX');
    const startY = dataTransfer.getData('startY');
    // 类型断言
    const dom = document.querySelector(`.panel.node.${type}`) as HTMLElement;
    const content = document.querySelector('.' + styles['content']) as HTMLElement;
    const canvas = document.querySelector('.' + styles['canvas']) as HTMLElement;
    const newNode: INode = {
      id: `node_${type}_${+new Date()}`,
      type,
      label: dom?.innerText,
      positionX: getMin(endX - startX - 180 + content?.scrollLeft + canvas?.scrollLeft, 0),
      positionY: getMin(endY - startY + dom?.offsetTop + content?.scrollTop + canvas?.scrollTop, 0),
    }
    // 钩子
    if (!beforeAddNode || beforeAddNode(newNode, nodes, edgs)) {
      setNodes([...nodes, newNode])
      onChange && onChange([...nodes, newNode], edgs, 'addNode')
    }
  }

  const handleDeleteNode = (nodeId: string) => {
    const newEdgs = edgs.filter(edg => edg.from !== nodeId && edg.to !== nodeId)
    const newNodes = nodes.filter(node => node.id !== nodeId)
    if (!beforeDeleteNode || beforeDeleteNode(nodeId, nodes, edgs)) {
      jsPlumbInstance.removeAllEndpoints(nodeId);
      setEdgs(newEdgs)
      setNodes(newNodes)
      onChange && onChange(newNodes, newEdgs, 'deleteNode')
    }
  }

  const addNode = (node: INode) => {
    jsPlumbInstance.makeSource(node.id, getJsplumbSourceOptions())
    jsPlumbInstance.makeTarget(node.id, getJsplumbTargetOptions())
    jsPlumbInstance.draggable(node.id, {
      containment: 'parent',
      stop: function (el: any) {
        const {pos: [positionX, positionY ]}  = el
        // hooks快照原因 要拿到最新的nodes
        setNodes((nodes) => {
          const findNode = nodes.find(n => n.id === node.id)
          const otherNode = nodes.filter(n => n.id !== node.id)
          if (findNode) {
            findNode.positionX = positionX
            findNode.positionY = positionY
            return [...otherNode, findNode]
          }
          return nodes
        })
      }
    })
  }

  const renderForm = () => {
    if (!currentChosen) {
      return <Empty description="暂无数据"/>
    }
    const { info } = currentChosen
    const register = currentChosen.type === 'node' ? getRegisteredNodesByType(info.type) : getRegisteredLines()[0]
    if (!register) {
      return <Empty description="暂无数据"/>
    }
    // 如果是用setter的
    if (register?.setterProps) {
      return (
        <SetterForm
          ref={formRef}
          key={`${info?.from}${info?.to}${info?.id}`}
          setterConfig={register.setterProps}
          defaultValue={currentChosen?.info?.data}
        />
      ) 
    }
    // 用传入form的
    else if (register?.customFormComponent) {
      const Component = register.customFormComponent;
      return (
        <Component
          ref={formRef}
          defaultValue={currentChosen?.info?.data}
          globalVars={globalVars}
        />
      )
    }
    return <Empty description="暂无数据"/>
  }

  const handleCanvasScale = (type: string) => {
    const nextCanvasScale = canvasScale + (type === 'zoom-in' ? 1 : -1) * currentScale.stepValue;
    if (nextCanvasScale <= currentScale.maxValue && nextCanvasScale >= currentScale.minValue) {
      setCanvasScale(nextCanvasScale);
    }
  };
  const handleSubmit = () => {
    const { info } = currentChosen || {}
    const register = currentChosen?.type === 'node' ? getRegisteredNodesByType(info?.type) : getRegisteredLines()[0]
    formRef?.current?.validateFields().then((value) => {
      if (currentChosen?.type === 'node') {
        updateNodes(value, register)
      } else if (currentChosen?.type === 'line') {
        updateEdgs(value, register)
      }
      setDrawerVisible(false)
    })
    .catch(err => {})
    // .finally()
  }

  const updateNodes = (value: any, register: any) => {
    const { info } = currentChosen || {}
    setNodes((nodes: any) => {
      const otherNodes = nodes.filter((n: any)=> n.id !== info?.id)
      const node = Object.assign(info, {})
      if (register?.setterProps) {
        let newData: any = {}
        Object.keys(register?.setterProps?.schema).forEach(key => {
          const va = value[key]
          newData[key] = va
        })
        node.data = newData
      } else {
        node.data = {
          ...value
        }
      }
      return [...otherNodes, node]
    })
  }

  const updateEdgs = (value: any, register: any) => {
    const { info } = currentChosen || {}
    setEdgs((edgs: any) => {
      const { conn } = info || {}
      if (conn) {
        // 更新overlays
        const labelOverlay = conn?.getOverlay("connectLabel")
        labelOverlay?.setLabel(value?.label || '')
        const otherEdgs = edgs.filter((e: any) => e.from !== info?.from || e.to !== info?.to)
        const newEdg = Object.assign(info, {})
        if (register?.setterProps) {
          let newData: any = {}
          Object.keys(register?.setterProps?.schema).forEach(key => {
            const va = value[key]
            newData[key] = va
          })
          newEdg.data = newData
        } else {
          newEdg.data = {
            ...value
          }
        }
        delete newEdg.conn
        return [...otherEdgs, newEdg]
      }
      return edgs
    })
  }

  return (
    <div className={styles['wrap'] + (className ? ' ' + className : '')}>
      <div className={styles['panel'] + (panelClassName ? ' ' + panelClassName : '')}>
        <div className={styles['middle-panel']}>
          <Panel
            defaultData={getRegisteredNodes()}
            onDragStart={handleDragStart}
          />
        </div>
        <div className={styles['controller']}>
          <img src={zoomOutIcon} alt="zoom-out" style={{cursor: canvasScale === currentScale.minValue ? 'not-allowed' : ''}} onClick={() => handleCanvasScale('zoom-out')} />
          <span>{(canvasScale * 100) + '%'}</span>
          <img src={zoomInIcon} alt="zoom-in" style={{cursor: canvasScale === currentScale.maxValue ? 'not-allowed' : ''}} onClick={() => handleCanvasScale('zoom-in')} />
        </div>
      </div>
      <div className={styles['content']}>
        <div
          className={styles['canvas'] + (canvasClassName ? ' ' + canvasClassName : '')}
          style={{width: (canvasScale * 100) + '%', height: (canvasScale * 100) + '%'}}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {
            nodes?.map((data) => (
              <Node
                key={data.id}
                data={data}
                globalVars={globalVars}
                handleDelete={handleDeleteNode}
                initNode={addNode}
                handleClick={setCurrentChosen}
                setDrawerVisible={setDrawerVisible}
                refreshCanvas={refreshCanvas}
              />
            ))
          }
        </div>
      </div>
      <Drawer
        getContainer={false}
        title='配置'
        width={1000}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        destroyOnClose
        drawerStyle={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}
        bodyStyle={{ marginBottom: '53px', flex: 1, overflow: 'auto' }}
      >
        {renderForm()}
        <div className={styles['drawer-footer']}>
          <Button style={{ marginRight: 8 }} onClick={() => setDrawerVisible(false)}>取消</Button>
          <Button type='primary' onClick={handleSubmit}>确定</Button>
          </div>
      </Drawer>
    </div>
  );
})

export default Canvas
