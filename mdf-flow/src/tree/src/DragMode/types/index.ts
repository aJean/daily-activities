import React from 'react';

export interface ICanvasExposeProps {
  getAllData: () => any
}

export interface ICanvasProps {
  // 注册的节点
  registerNodes?: IRegisterNode[];
  // 注册的线
  registerLines?: IRegisterLine[];
  // 节点数组-done
  nodes: INode[];
  // 连线数组-done
  lines: ILine[];
  // 连线的颜色-done
  lineColor?: string;
  // 全局变量
  globalVars?: any;
  // 添加一个节点前触发-done
  beforeAddNode?: (node: INode, nodeList: INode[], lineList: ILine[]) => boolean;
  // 添加一条连线前触发-done
  beforeAddConnection?: (fromNodeID: string, toNodeId: string, nodeList:INode[], lineList:ILine[], conn: any) => boolean;
  // 删除一个节点前触发-done
  beforeDeleteNode?: (nodeId: string, nodeList: INode[], lineList: ILine[]) => boolean;
  // 删除一条连接前触发-done
  beforeDeleteConnection?: (line: ILine, nodeList: INode[], lineList: ILine[]) => boolean;
  // node或者是line改变时触发-done
  onChange?: (nodeList: INode[], lineList: ILine[], actionName: string) => void;
  // 容器样式
  className?: string;
  panelClassName?: string;
  canvasClassName?: string;
  // 缩放
  scale?: {
    initialValue?: number;
    maxValue?: number;
    minValue?: number;
    stepValue?: number;
  };
}

export interface INode {
  id: string; // 节点唯一 id
  type: string;  // 节点类型
  label: string; // 节点名称
  positionX: number; // 画布中的x坐标
  positionY: number; // 画布中的y坐标
  data?: object; // 配置项表单的数据
}

export interface IDisplayComponentProps {
  data: INode;
  globalVars?: any;
  handleDelete: (nodeId: string) => void;
  refreshCanvas: () => void;
}

interface ISetterProps {
  schema?: any; // 配置项
  components?: any; // 配置项中的自定义组件 key-value的形式
}

// 注册节点
export interface IRegisterNode {
  label: string; // 节点名称
  type: string; // 节点类型
  displayComponent?: React.FC<IDisplayComponentProps>; // 节点的具体表现形式
  validator?: (node: INode) => boolean; // 校验器
  classFilter?: string; // 有该class的元素才可以连线 如“.flow-node-drag”
  setterProps?: ISetterProps, // 用setter配置表单
  customFormComponent?: React.FC<{ref: any, defaultValue: any, globalVars: any}>; // 用户自定义表单
}

// 注册线
export interface IRegisterLine {
  setterProps?: ISetterProps, // 传入setter的配置
  customFormComponent?: React.FC<{ref: any, defaultValue: any}>; // 用户自定义表单
}
export interface ILine {
  from: string, // 节点唯一 id
  to: string, // 节点唯一 id
  label?: string, // 线的label
  data?: object; // 配置项表单的数据
}


export interface ITempData {
  from: string, // 节点唯一 id
  to: string, // 节点唯一 id
  label?: string, // 线的label
  conn?: any, // Connection对象
}

export interface ICurrentChosenData {
  type: string, // node 或者是 line
  info: ITempData | INode, // 具体信息
}

export interface IRefFormMethod {
  getFieldsValue: () => any;
  validateFields: () => Promise<any>,
}