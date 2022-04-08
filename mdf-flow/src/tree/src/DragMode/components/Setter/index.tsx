import React from 'react';
import { Button, Empty, message } from 'antd'
import { INode, ILine, IRegisterNode, ICurrentChosenData } from '../../types'
import { getRegisteredNodesByType } from '../../utils'
import { Setter, createFormActions, createAsyncFormActions } from '@byted-cg/builder-setters';

const actions = createAsyncFormActions();

const lineSchema ={
  label: {
    title: '优先级',
    'x-component': 'input',
  },
}
interface ISetterPaneProps {
  currentData: ICurrentChosenData,
  setNodes: (node: INode) => void,
  setEdgs: (edg: ILine) => void
}

const SetterPane: React.FC<any> = (props) => {
  const { currentData, setNodes, setEdgs } = props;
  const { type, info } = currentData || {}

  const updateNodes = (value: any) => {
    const currentResigerNode = getRegisteredNodesByType(info?.type) || {label: '', type: ''}
    setNodes((nodes: any) => {
      const otherNodes = nodes.filter((n: any)=> n.id !== info.id)
      const node = Object.assign(info, {})
      let newData: any = {}
      Object.keys(currentResigerNode?.setterProps?.settingSchema).forEach(key => {
        const va = value[key]
        newData[key] = va
      })
      node.data = newData
      return [...otherNodes, node]
    })
  }

  const updateEdgs = (value: any) => {
    setEdgs((edgs: any) => {
      const { conn } = info || {}
      if (conn) {
        // 更新overlays
        const labelOverlay = conn?.getOverlay("connectLabel")
        labelOverlay?.setLabel(value?.label || '')
        const otherEdgs = edgs.filter((e: any) => e.from !== info.from || e.to !== info.to)
        const newEdg = {
          from: info.from,
          to: info.to,
          label: value?.label || '',
        }
        return [...otherEdgs, newEdg]
      }
      return edgs
    })
  }
 
  const handleSubmit = () => {
    actions.submit((values) => {
      if (type === 'node') {
        updateNodes(values)
      } else if (type === 'line') {
        updateEdgs(values)
      }
      message.success('修改成功')
    })
  }

  const rengderForm = () => {
    let currentResigerNode: IRegisterNode = { label: '', type: '' }
    if (type === 'node') {
      currentResigerNode = getRegisteredNodesByType(info?.type) || {label: '', type: ''}
    }
    if (!currentData || (type === 'node' && !currentResigerNode?.setterProps?.settingSchema)) {
      return <Empty description="暂无数据"/>
    }
    return (
      <>
        <Setter
          key={`${info?.from}${info?.to}${info?.id}`}
          defaultValue={type === 'line' ? { label: info.label } : info?.data}
          schema={type === 'line' ? lineSchema : currentResigerNode?.setterProps?.settingSchema || {}}
          actions={actions}
          components={currentResigerNode?.setterProps?.settingComponent || {}}
        />
        <Button type="primary" onClick={handleSubmit}>确定</Button>
        <Button>取消</Button>
      </>
    )
  }
  return rengderForm()
};

export default SetterPane;
