import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { FixedCanvas as Canvas } from '../../src';
import { IRegisterNode, INode } from '../../src/FixedMode';

import Condition from './nodes/condition';
import ConfigForm from './forms';
import validator from './validators';

const defaultList = [
  {
    type: 'start',
    name: '开始',
    props: {
      addable: true,
    },
  },
  {
    type: 'end',
    name: '结束',
    props: {
      addable: true,
    },
  },
  {
    type: 'branch1',
    name: '分支节点1',
    condition: {
      type: 'condition1',
      name: '条件节点1',
      displayComponent: Condition,
      props: {
        addable: true,
        configurable: true,
      },
      customConfigComponent: ConfigForm,
      validator,
    },
    props: {
      addable: true,
    },
  },
  {
    type: 'branch2',
    name: '分支节点2',
    condition: {
      type: 'condition2',
      name: '条件节点2',
      displayComponent: Condition,
      props: {
        configurable: true,
      },
      setterConfig: {
        schema: {
          label: {
            title: '标题2',
            required: true,
            'x-component': 'Input',
          },
        }
      },
    },
    props: {
      addable: true,
    },
  },
  {
    type: 'approval',
    name: '审批节点',
    props: {
      addable: true,
      configurable: true,
    },
    validator: validator,
    customConfigComponent: ConfigForm,
  },
];

const App = () => {
  const [data, setData] = useState<INode[]>([]);
  const [horizontalLayout, setHorizontalLayout] = useState<boolean>(false);
  const [popupOnBody, setPopupOnBody] = useState<boolean>(false);
  const [list, setList] = useState<IRegisterNode[]>(defaultList);

  // 流程树的变化全部由这个方法触发，基于 data 的改变
  const handleChange = (data: INode[]) => {
    console.log('data', data);
    setData(data);
  };

  return (
    <>
      <Button onClick={() => setData([])}>重置</Button>
      <Button onClick={() => setHorizontalLayout(!horizontalLayout)}>布局</Button>
      <Button onClick={() => setPopupOnBody(!popupOnBody)}>set popupOnBody {String(!popupOnBody)}</Button>
      <Canvas
        registerNodes={list}
        data={data}
        onChange={handleChange}
        horizontalLayout={horizontalLayout}
        showScale
        popupOnBody={popupOnBody}
        drawerConfig={{
          width: 500,
        }}
      />
    </>
  )
};

export default App;
