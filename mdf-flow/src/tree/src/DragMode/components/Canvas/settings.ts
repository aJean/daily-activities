import styles from './index.css'
let settings = {
    // 动态锚点、位置自适应
    Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter', 'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'],
    // 端点的默认样式
    Endpoint: ['Blank', {Overlays: ''}],
    EndpointStyle: {
      fill: 'grey',
      radius: 3,
    },
    EndpointHoverStyle: {
      fill: 'green',
      radius: 5,
    },
    // 边的默认样式
    PaintStyle: {
      stroke: '#94bff0',
      strokeWidth: 5,
    },
    HoverPaintStyle: {
      stroke: 'green',
      strokeWidth: 6,
    },
    // 连接线类型
    Connector: ['Flowchart', {
      gap: 5,
      cornerRadius: 5,
      alwaysRespectStubs: true,
    }],
    // 在线上显示label
    ConnectionOverlays: [
      [ "Label", {
        id: 'connectLabel',
        label: "+",
        location: 0.5,
        cssClass: styles['flowLabel']
      }]
    ],
    // 边上面的内容的默认样式
    Overlays: [
      ['Arrow', {
        width: 20, // 箭头尾部的宽度
        length: 13, // 从箭头的尾部到头部的距离
        location: 1, // 位置，建议使用0～1之间
        direction: 1, // 方向，默认值为1（表示向前），可选-1（表示向后）
        foldback: 0.623, // 折回，也就是尾翼的角度，默认0.623，当为1时，为正三角
      }],
    ],
  }
  
let jsplumbSourceOptions = {
    // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
    filter: '',
    filterExclude: false,
    anchor: 'Continuous',
    // 是否允许自己连接自己
    allowLoopback: false,
    maxConnections: -1,
}

let jsplumbTargetOptions = {
  // uniqueEndpoint: true,
  // dropOptions: {hoverClass: 'ef-drop-hover'}
  // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
  filter: '',
  filterExclude: false,
  // 是否允许自己连接自己
  anchor: 'Continuous',
  allowLoopback: false,
  customer: '自定义'
}

let jsplumbConnectOptions = {
  isSource: true,
  isTarget: true,
  // 动态锚点、提供了4个方向 Continuous、AutoDefault
  anchor: 'Continuous',
  // 设置连线上面的label样式
  // labelStyle: {
  //     cssClass: styles['flowLabel']
  // },
}

export const setTargetAndSourceFilter = (filter: string) => {
  jsplumbTargetOptions.filter = filter
  jsplumbSourceOptions.filter = filter
}

export const setPaintStyleSetting = (color: string = '#94bff0') => {
  settings.PaintStyle.stroke = color
}

export const getSettings = () => settings

export const getJsplumbSourceOptions = () => jsplumbSourceOptions

export const getJsplumbTargetOptions = () => jsplumbTargetOptions

export const getJsplumbConnectOptions = () => jsplumbConnectOptions


  