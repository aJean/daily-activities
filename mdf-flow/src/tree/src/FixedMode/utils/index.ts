import { v4 as uuid } from "uuid";
import { DEFAULT_NODE_PROPS } from "../constants";
import { IRegisterNode, INode } from "../types";

/**
 * @file helper for node operation
 */

export const getRandomId = (prefix = "sid") => {
  return `${prefix}-${uuid()}`;
};

// 注册节点
// export const registerNodes = (nodes: IRegisterNode[]) => {
//   for (const node of nodes) {
//     const registerTypeIndex = registerNodeList.findIndex(item => item.type === node.type);
//     if (node.condition) {
//       registerNodes([node.condition]);
//     }
//     if (registerTypeIndex > -1) {
//       registerNodeList[registerTypeIndex] = node;
//     } else {
//       registerNodeList.push(node);
//     }
//   }
// };

const flatRegisterNodesFormatter = (registerNodeList: IRegisterNode[]) => {
  const list: IRegisterNode[] = [];
  const flatNodes = (nodes: IRegisterNode[]) => {
    for (const node of nodes) {
      const registerTypeIndex = list.findIndex(
        (item) => item.type === node.type
      );
      if (node.condition) {
        flatNodes([node.condition]);
      }
      if (registerTypeIndex > -1) {
        list[registerTypeIndex] = node;
      } else {
        list.push(node);
      }
    }
  };
  flatNodes(registerNodeList);
  return list;
};

/**
 * 根据节点类型获取节点
 * @param registerNodeList 已注册节点列表
 * @param type 节点类型
 * @return 节点
 */
export const getRegisterNode = (
  registerNodeList: IRegisterNode[],
  type: string
) =>
  flatRegisterNodesFormatter(registerNodeList).find(
    (registerNode) => registerNode.type === type
  );

/**
 * 根据节点类型获取节点展示的组件
 * @param registerNodeList 已注册节点列表
 * @param type 节点类型
 * @return 节点展示的组件
 */
export const getDisplayNodeByType = (
  registerNodeList: IRegisterNode[],
  type: string
) => getRegisterNode(registerNodeList, type)?.displayComponent;

/**
 * 获取可添加的节点列表
 * @param registerNodeList 已注册节点列表
 * @return 可添加节点列表
 */
export const getAddableNodeList = (registerNodeList: IRegisterNode[]) =>
  flatRegisterNodesFormatter(registerNodeList).filter(
    (registerNode) =>
      registerNode.props?.addable &&
      !["start", "end"].includes(registerNode.type) &&
      !isConditionNode(registerNodeList, registerNode.type)
  );

/**
 * 根据节点类型获取自定义配置表单组件
 * @param registerNodeList 已注册节点列表
 * @param type 节点类型
 * @return 自定义配置表单组件
 */
export const getCustomConfigComponent = (
  registerNodeList: IRegisterNode[],
  type: string
) => getRegisterNode(registerNodeList, type)?.customConfigComponent;

/**
 * 根据节点类型获取 Setter 配置
 * @param registerNodeList 已注册节点列表
 * @param type 节点类型
 * @return Setter 配置
 */
export const getSetterConfig = (
  registerNodeList: IRegisterNode[],
  type: string
) => getRegisterNode(registerNodeList, type)?.setterConfig;

/**
 * 根据节点类型判断是否为分支节点
 * @param registerNodeList 已注册节点列表
 * @param type 节点类型
 * @return boolean
 */
export const isBranchNode: (
  registerNodeList: IRegisterNode[],
  type: string
) => boolean = (registerNodeList, type) =>
  !!getRegisterNode(registerNodeList, type)?.condition;

/**
 * 根据节点类型判断是否为条件节点
 * @param registerNodeList 已注册节点列表
 * @param type 节点类型
 * @return boolean
 */
export const isConditionNode: (
  registerNodeList: IRegisterNode[],
  type: string
) => boolean = (registerNodeList, type) =>
  !!type &&
  !!flatRegisterNodesFormatter(registerNodeList).some(
    (registerNode) => registerNode?.condition?.type === type
  );

export const createNewNodeData: (
  registerNodeList: IRegisterNode[],
  type: string | undefined
) => any = (registerNodeList, type) => {
  if (!type) return;
  const registerNodeTemplate = getRegisterNode(registerNodeList, type);
  const basicData = {
    id: getRandomId(),
    type,
    name: registerNodeTemplate?.name || "",
    props: JSON.parse(JSON.stringify(DEFAULT_NODE_PROPS)),
    data:
      registerNodeTemplate?.setDefaultData?.(registerNodeTemplate) || undefined,
    customProps: registerNodeTemplate?.customProps,
  };
  if (isConditionNode(registerNodeList, type)) {
    return {
      ...basicData,
      next: [],
    };
  } else if (isBranchNode(registerNodeList, type)) {
    return {
      ...basicData,
      branchs: [
        createNewNodeData(
          registerNodeList,
          registerNodeTemplate?.condition?.type
        ),
        createNewNodeData(
          registerNodeList,
          registerNodeTemplate?.condition?.type
        ),
      ],
    };
  }
  return basicData;
};

/**
 * 这个用来查找 node 在整个 tree 中所处的 list 以及在 list 中的 index
 */
export const getCurrentListAndIndex: (
  node: INode,
  list: INode[],
  parentNode?: INode,
  parentList?: INode[]
) =>
  | {
      index: number;
      list: INode[];
      parentNode?: INode;
      parentList?: INode[];
    }
  | undefined = (node, list, parentNode, parentList) => {
  const index = list.findIndex((item) => item.id === node.id);
  if (index >= 0) {
    return {
      index,
      list,
      parentNode,
      parentList,
    };
  } else {
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      const { branchs, next } = item;
      if (Array.isArray(branchs)) {
        const result = getCurrentListAndIndex(node, branchs, item, list);
        if (result) {
          return result;
        }
      }
      if (Array.isArray(next)) {
        const result = getCurrentListAndIndex(node, next, item, list);
        if (result) {
          return result;
        }
      }
    }
  }
};

/**
 * 用于根据 schema 判断类型，然后将节点添加到正确的属性上
 */
export const addNode: (
  registerNodeList: IRegisterNode[],
  currentNode: INode,
  newNode: INode,
  nodes: INode[]
) => void = (registerNodeList, currentNode, newNode, nodes) => {
  const deepFindResult = getCurrentListAndIndex(currentNode, nodes);
  if (!deepFindResult) {
    return;
  }
  const { index, list } = deepFindResult;

  if (isConditionNode(registerNodeList, currentNode.type)) {
    currentNode?.next?.unshift(newNode);
  } else if (isConditionNode(registerNodeList, newNode.type)) {
    currentNode?.branchs?.push(newNode);
  } else {
    list.splice(index + 1, 0, newNode);
  }
};

export const removeNode: (currentNode: INode, nodes: INode[]) => void = (
  currentNode,
  nodes
) => {
  const deepFindResult = getCurrentListAndIndex(currentNode, nodes);
  if (!deepFindResult) {
    return;
  }
  const { index, list, parentNode, parentList = [] } = deepFindResult;

  list.splice(index, 1);

  // 删除空的网关节点
  if (parentNode?.branchs?.length === 0) {
    removeNode(parentNode, parentList);
  }
};

export const getHorizontalClassName = (bool: boolean) =>
  !!bool ? "horizontal" : "vertical";
