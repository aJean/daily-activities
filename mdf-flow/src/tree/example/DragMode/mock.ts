import NodeCard from './nodes/NodeCard'
import TriggerCard from './nodes/TriggerCard'
import CustomCom from './nodes/CustomCom'
import ConfigForm from './forms'

export const usableLines = [
  {
    setterProps: {
      schema: {
        label: {
          title: '优先级',
          'x-component': 'input',
        },
      }
    }
  }
]

export const usableNodes = [
  {
    type: 'start',
    label: '开始节点',
    displayComponent: NodeCard,
    classFilter: '.flow-node-drag',
    setterProps: {
      schema: {
        name: {
          title: '节点名称',
          'x-component': 'Input',
        },
        dealType: {
          title: '处理模式',
          'x-component': 'Input',
        },
        informerType: {
          title: '知会人类型',
          'x-component': 'Input',
        },
        handlerType: {
          title: '处理人类型',
          'x-component': 'Input',
        },
        abc: {
          title: 'asdad',
          'x-component': 'mycom'
        }
      },
      components: {
        mycom: CustomCom,
      },
    },
  },
  {
    type: 'trigger',
    label: '触发器',
    displayComponent: TriggerCard,
    classFilter: '.flow-node-drag',
    setterProps: {
      schema: {
        actionName: {
          title: '动作名称',
          'x-component': 'Input',
        },
        status: {
          title: '状态开关',
          'x-component': 'Input',
        },
        rules: {
          title: '触发条件',
          'x-component': 'Input',
        },
        actions: {
          title: '执行动作',
          'x-component': 'Input',
        },
      },
    }
  },
  {
    type: 'normal',
    label: '中间节点',
    displayComponent: NodeCard,
    classFilter: '.flow-node-drag',
    customFormComponent: ConfigForm
  },
  {
    type: 'end',
    label: '结束节点',
    displayComponent: NodeCard,
    classFilter: '.flow-node-drag'
  },
]

export const defaultNodes = [
  {
    id: '1',
    type: 'start',
    label: '开始节点',
    positionX: 100,
    positionY: 100,
    data: {
      name: 'custom start name',
      dealType: '认领',
      informerType: '知会人',
      handlerType: '处理人',
      abc: '暂无',
    }
  },
  {
    id: '2',
    type: 'trigger',
    label: '触发器',
    positionX: 500,
    positionY: 200,
    data: {},
  },
  {
    id: '3',
    type: 'normal',
    label: '中间节点',
    positionX: 800,
    positionY: 200,
    data: {},
  },
  {
    id: '4',
    type: 'end',
    label: '结束节点',
    positionX: 600,
    positionY: 500,
    data: {},
  },
];

export const defaultEdgs = [
  {
    from: '1',
    to: '2',
    data: {
      label: ''
    }
  }
];
