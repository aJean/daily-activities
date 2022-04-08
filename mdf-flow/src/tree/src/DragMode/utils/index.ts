import { ILine, IRegisterNode, IRegisterLine } from '../types'

let registerNodeList: IRegisterNode[] = []
let registerLineList: IRegisterLine[] = []
// 注册节点
export const registerNodes = (nodes: IRegisterNode[]) => {
  registerNodeList = []
  for (const node of nodes) {
    registerNodeList.push(node)
  }
}
// 注册线
export const registerLines = (lines: IRegisterLine[]) => {
  registerLineList = []
  for (const line of lines) {
    registerLineList.push(line)
  }
}

export const getRegisteredNodes = () => registerNodeList

export const getRegisteredNodesByType = (type: string) => registerNodeList.find( i => i.type === type)

export const getRegisteredLines = () => registerLineList

export const hasLine = (from: string, to: string, edgs: ILine[]) => {
    for (const edg of edgs ) {
      if (edg.from === from && edg.to === to) {
        return true
      }
    }
    return false
  }

export const getMin = (n: number, m: number) => n > m ? n : m;

