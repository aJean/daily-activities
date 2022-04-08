import React from 'react';
import { ISchemaForm } from '@byted-cg/builder-setters';

export interface IRegisterNodeProps {
  addable?: boolean; // 能否被添加
  icon?: string; // 能够添加时的图标
  configurable?: boolean; // 节点能否进行配置
}

export interface IRegisterNode {
  type: string;
  name: string;
  displayComponent?: React.FC<{node: INode}>;
  condition?: IRegisterNode;
  props?: IRegisterNodeProps;
  customProps?: any;
  setterConfig?: ISchemaForm;
  customConfigComponent?: React.FC<{ref: any, defaultValue: any, node?: INode}>;
  validator?: (node: INode) => boolean;
  setDefaultData?: (node: IRegisterNode) => any;
}

export interface INodeProps {
  isEditing: boolean,
  invalid: boolean;
}

export interface INode {
  id: string;
  type: string;
  name: string;
  branchs?: INode[];
  next?: INode[];
  props: INodeProps;
  data: any;
  customProps?: any;
}


export interface IRefFormMethod {
  getFieldsValue: () => any;
  validateFields: () => Promise<any>,
}
