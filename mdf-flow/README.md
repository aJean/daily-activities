# Getting Started

## 是否对节点类型进行封装
如果不区分，渲染时候方便一些，canvas 里面一个递归直接渲染树了
但是在决定节点样式和类型的时候需要多做一些处理

### 外部渲染模式
NodeItem、NodeWrap、NodeComponent 组成一个完成的 ui node，其中 NodeComponent 只负责节点文本区域，可以进行注册
- 渲染器负责循环 nodeList，判断渲染类型，组合上面的三类 node 元件
- 渲染器负责传入 node children
- 操作 action 时通过 id 遍历 nodeList，找到当前操作的节点，进行处理
- 任何节点的变化直接对 nodeList 进行修改即可更新 view
- nodeList 由 app 传入，内部操作节点最终调用 setAppNodes 来整体更新
- 可扩展的 nodeSchema 用于辅助渲染器判断 ui 类型，例如开始节点、结束节点、分支节点、条件节点等...
- NodeComponent 是一种 display ui，数据中可以指定用那种组件来展示样式，但分支节点还是条件节点要看是否有对应的数据结构（branchs)

### 修改节点
每一个节点都会对应一个绑定数据 nodeData，这个数据记录在操作组件中，增加删除节点时基于这个 nodeData 对原始的 list 进行修改
然后整体更新 list
修改方法在最外层控制，也就是获取 list 的那一层

### schema
用于描述节点类型、ui、行为，可以使元数据与业务数据分离，更便于扩展
- displayComponent
- style
- type
- info


### 内部封装模式
将节点分为 Node，BranchNode，CondiNode、StartNode、EndNode 等元类型，每个类型会处理自己的 ui 以及行为
问题在于在什么位置进行递归，同时能尽量减少重复逻辑
- 节点类型在 ui、或行为上的区别由不同类型的节点内部处理，所以不需要提供 schema
- 通过 context 将 handleNodeList 传的很深
- 每个类型的 Node 都要自己处理 children，无法通过高阶组件传入
- 这个模式不适合构建 tree
