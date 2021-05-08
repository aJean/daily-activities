Vue 呀，深入的研究一下

### 目录
- compiler 将 template 编译成 render function
- core 核心
- server 服务端渲染相关
- palteform 跨平台，比如 web、weekx、mpvue，放不同平台编译代码或运行时
- sfc 单文件组件解释器
- shared 共享的常量或方法

#### runtime + compiler
- 早期项目可能没有工程构建的过程，所以会提供运行时编译的功能
- 就像 react 早起版本也有 react-transform.js

### palteforms
对 vue 上面的方法做不同平台的处理，比如 $mount 方法，只有平台相关的 runtime 会定义 $mount，这里用的是 core/lifecircle 的 mountComponent
但是 runtime 和 runtime-compiler 又定义了不同的 $mount

- plateforms/web/entry-runtime-with-compiler
- plateforms/web/runtime/index.js
- core/instance/index.js

### 启动
一切都始于 new Vue()，执行 this._init，内部会有一系列的初始化工作 initEvents、initRender、initState ...

#### initProxy
dev 环境对 vm._renderProxy 设置代理，在访问未定义属性时给予报错提示

#### initState
会处理 vm 上的属性，比如 data、props、methods、watcher、computed
- methods 里的 fn 直接挂载到 vm 上
- props 通过 proxy _props 代理到 vm，这样做是为了在 renderFunction 中直接 with(this) 就可以拿到所有属性和数据
- data 通过 proxy _data 代理到 vm
- 对 data 进行响应式处理，就是执行 observe

#### $mount
执行 dom 挂载，定义在 web/runtime/index.js 中，本身比较简单，查找 el 执行 mountComponent
但是 entry-runtime-with-compiler 会重写这个 $mont，加入对 template 运行时编译的逻辑

#### entry-runtime-with-compiler
判断当前 vm 对象有没有 options.render（工具构建的都会生成这个方法），没有就要进行运行时 compile

- 首先找到 template，这里可以自己传 string 或者 dom node，再或者直接使用 el 的 outHtml，都没传就等着报异常吧
- 通过 compileToFunctions 将 template 生成 $options.render 和 $options.staticRenderFns，就是 vue-loader 做的事情
- 然后执行 Vue.prototype.$mount 之后就是一致的流程了

#### mountComponent
- 首先找 $options.render，如果没有只能创建 emptyVnode
- 生成 updateComponent 函数
- 创建渲染 watcher，传入 updateComponent，并且初始执行一次，保存 vm._watcher，$forceUpdate 时候也会使用
- 执行 mount 生命周期
```javascript
// 渲染 watcher 的 getter 就是 updateComponent，这样一调用 watcher.get() 就会渲染界面
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

#### vm._render
主要代码在 src/core/instance/render.js，作用是创建 vnode tree

- 调用 this.$options.render，也就是上面编译生成的 render 方法，最终返回 vnode
- 编译生成 render 函数使用 _c，自定义的使用 $createElement，区别是 $createElement 会对 children 做处理，因为有可能会传文本值
```javascript
// _renderProxy 是代理对象主要用于检查模板里使用的属性有没有定义过
// vm.$createElement 就是提供给 render 方法的参数 h
vnode = render.call(vm._renderProxy, vm.$createElement)
// 降级策略，出现异常时允许用户渲染兜底方案
vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
// 如果返回的 vnode 超过一个，同样会报错，就和 react 之前不支持返回数组一样
vnode = createEmptyVNode()
```

#### vnode
虚拟 dom 一个抽象的数据结构，内存计算、跨平台，代码在 src/vnode 下面
- vue 基于开源库 snabbdom 实现自己的 vnode diff

#### createElement
_c 和 $createElement 都是调用 vdom/create-element.js 里的 createElement 方法，区别是如何处理 children
- 首先处理 children，通过 normalizeChildren 将基础值生成 text vnode，如果是数组进行 flatten
- 根据 tag 类型创建 component 或者 vnode
- vm.$mount 开始渲染 dom - mountComponent - vm._update(vm._render(), hydrating)

#### vm._update
将 vnode 渲染到页面，代码在 core/instance/lifecycle.js 中
内部会调用 vm.__patch__，src/platforms/web/runtime/patch

- 首先执行 createPatchFunction，参数是 platforms/web 提供的两个集合，{ nodeOps, modules }
- modules 表示属性 hooks，会保存在内部的 cbs 中，snabbdom 在 patch 过程中会执行不同阶段的钩子，这里是建立联系
- nodeOps 表示节点操作方法，会在 createElm 中用到，比如 vnode.elm = nodeOps.createElement(tag, vnode)
- platforms/web/createPatchFunction  --> (平台差异性 hooks) --> src/core/vdom/patch.js
- 这样设计是将与宿主平台相关的操作隔离出去，core 里面只处理通用逻辑，同理 react 的 renderer
```javascript
export const patch: Function = createPatchFunction({ nodeOps, modules })
```

#### 一些思考
Vue 本身就是一个 function，非常简单，通过不同的 mixins 将功能写入 prototype，使 vue instance 具有这些能力
- 跨平台架构，vdom 本身是一个抽象的数据结构，vue 将 dom patch 和 dom functions 做分离设计，functions 与平台强关联
- runtime-only 和 runtime-compiler，给使用者更多架构方面的选择
- proxy 的使用，将 data、props 代理到 vm this 上面，方便用户读取；另外也可以做访问权限限制


### 组件化
render 函数可以直接渲染组件，h => h(App)

#### 流程
- 入口是 new vue，先初始化 _init 会执行很多 initXXX，然后执行 $mount 和 _update， 这是一个主线
- _update 调用 opts.render 内部使用 createElement 生成 vnode， 可能是 dom vnode 也可能是 component vnode 
- vdom/createElement 将创建子组件的 Ctor，并执行 installComponentHooks 安装 componentVNodeHooks
- patch 期间通过 createElm 将 vnode 转化为 dom element，这里会尝试先执行 patch/createComponent，调用 hooks.init 
- componentVNodeHook.init 会执行 createComponentInstanceForVnode 创建组件 instance 
- createComponentInstanceForVnode 就是 new 组件的 Ctor，同时将 InternalComponentOptions 传给 Ctor
- 然后执行 instance.$mount 继续向下 patch
- 如果不是 component node，就会通过 nodeOps 创建 dom element，完成 mount 流程

#### vdom/createComponent
使用 vue.extend 创建组件构造器，内部会有 cid 缓存，避免同一个组件多次创建
通过 Vue.cid 把生成的 Ctor 构造函数缓存到 Compoent 的 plain object 本身，避免同一类组件重复创建

- 注意一下这几个 api 的区别：Vue.extend 创建组件类，Vue.component 将组件类注册到全局，Vue.mixin 所有 instance 中混入属性
- 集成 Vue 生成组件构造器、异步组件处理、merge 组件 vnode hook
- 最后生成组件类别的 vnode，构造器和 children 都会放到 componentOptions 里面

#### createComponentInstanceForVnode
- 生成 options 作为 new Ctor 的参数，这里有比较重要的属性 _parentVnode 和 parent 以及 isComponent
- _parentVnode 就是当前这个组件的占位 vnode，parent 是父组件的 this， 在上一次 _update 时候设置的
- 返回 new vnode.componentOptions.Ctor()，也就是用组件构造器生成 instance
- 实例化调用执行 _init，如果 isComponent 是 true，就会执行 initInternalComponent，把传给构造器的参数放到 vm.$options 上
- 执行 initLifecycle 时候会创建 parent.$children 和 this.$parent，建立 instance 之间的关系
- 然后流程一样，执行 _render 时会给生成的 component vnode 添加 parentVnode

#### vm._vnode
在 src/instance/lifecycle.js 的 _update 中赋值
- 上一次的 vnode 结构，会与本次 render 生成 vnode 一起做 dom diff
- vm.$vnode == vm._vnode.parent，是父组件在 _render 时创建的子组件的占位 vnode，带有 componentOptions 信息
- vnode 可以通过 parent 或 children 进行遍历查找 

#### 思考
组件树如何构建，实例之间如何建立联系
可以看到这是一个深度优先递归的流程，如果是 dom vnode 就执行宿主方法创建 dom element
如果是 component vnode，就 new instance 然后再向下 mount！
- 要理解 render 返回的是 vnode，patch 是将 vnode 更新到 dom 中
- instance 关系维护： this.$parent、this.$children，有啥用呢，举个例子 $destroy 时需要将依赖也一起 remove
- this._vnode 实例本身的 vnode，this.$vnode == vnode.parent 是组件实例化之前创建的占位 vnode
- vm.$el == vnode.elm == patch 返回的 dom element
- vnode.componentInstance 当前 vnode 节点所属的组件 instance
- 每次 _update 使用 setActiveInstance 将 this 保存在一个全局对象上，这样内部需要创建新组实例时可以直接拿到上下文
- patch/createComponent 递归

#### vm.$el
初始化时 component vnode 都是没有 $el 的，那么它们的 $el 是怎么来的呢？
- update 时会执行 vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false)
- 然后就是一个固定流程 patch - createElm - createComponent - createElement(tag)，遇到组件就继续递归执行
- 当处理到 dom Vnode 的时候，会终止递归并创建 elm，然后通过 initComponent 把 elm 设置回去
- 流程返回到祖先的 dom Vnode 时候，执行挂载，因为 dom vnode 是通过 createChildren 创建子 vnode，而不是递归
- 如果 createElm 发现不是组件 vnode，会执行 document.createElement(tag, vnode) 创建 elm
- 对于 children vnode 来说，它们的 parentElm 就是这个 elm！！

#### 节点挂载
总结一下就是 dom vnode 在 createElm 内部执行挂载，component vnode 在 createComponent 内部执行挂载
- 最外层是我们手动传入的 el，这个会在 $mount 时候做处理直接赋值给 vnode.$el
- 如果是 dom vnode，会在 createElm 时候根据 tag 生成对应的 element 作为 vnode.el，他的 child vnode 都会挂载到上面
- 如果是 component vnode，在 patch/createComponent 时候执行 data.hook.init 做实例化，这时候这个组件本身是没有 el 的
- 但是组件又会自己执行 $mount 和 patch，patch 一定会最终返回一个 el 给组件，也就是 this.$el = __patch()__
- 可以看到执行完 hook 后，initComponent 调用时组件的 instance 已经有了 $el
- 这时候再进行 insert(parentElm, vnode.elm, refElm)

#### 参数合并
引入 Vue 的时候注册 initGlobalAPI，会生成 Vue.options
将 Vue.options 与构造器参数的 options 进行合并，作为内部的 this.$options
这里可能会有 mixin、extend、Vue.options._base（createComponent 时做 extend 集成用到）

- 合并是在 this._init 里面完成的，因为必须把参数处理放在 $mount 之前
- initInternalComponent 组件参数合并，会用到 Ctor.options，这个本质上也会包含 Vue.options，因为在 Vue.extend 里面做了处理
- Vue.mixin 之所以是全局 mixin，就是因为这个方法执行了 Vue.options = mergeOptions(Vue.options, mixin)
- 而我们 new Vue({ mixin }) 只会对这个 instance 起作用

#### 生命周期
业务中最常用的几个生命周期函数
updated: src/observer/scheduler.js - callUpdatedHooks
destroyed: src/instance/lifecycle.js - $destroy
mounted: src/instance/lifecycle.js - mountComponent， src/core/vdom/create-component.js - insert
created: src/instance/init.js - _init，可以看到触发 created 时候 initState 已经执行完了，也就是 data observe 完成

- before 和 created 触发顺序是先父后子，updated、mounted、destroyed 是先子后父

#### 组件注册
代码在 src/global-api/assets.js

- 全局注册，所有组件中都可以用 Vue.component
- 局部注册，通过 components: [] 参数，只在组件域下可用，比如业务组件
- createElement 会对 tag 进行判断，这里传入的是 this.options
- 能被识别的 tag 有 dom 保留标签和 component
- 还有个问题就是组件初始状态是一个 plainObject，经过 Vue.extend 后变成 Ctor，这个过程在 Vue.component 或 createComponent 中都会做
- 然后 Vue 会把这个 Ctor 去替换原来的 Sub.options.components[id]，这样就保证同一个组件类只会执行一次 extend

#### 异步组件
当执行 vnode/createComponent 发现一个 Ctor 是 async component，就会进到 vdom/resolveAsyncComponent

- 首先直接返回一个注释 vnode 做本次渲染
- 给 factory 传入 resolve、reject，并根据返回值做异步处理
- 当执行 resolve 后，会设置 factory.resolved = exports，并且执行 this.$forceUpdate()，触发相关的 watch 重新 update
- 这个时候就可以拿到 factory.resolved，就和之前组件处理一样的流程了

### watcher 更新
响应式原理：发布订阅模式，可观察对象 data，观察者是 watcher，一定要理解 watcher 是用来响应 data 变化的东西
那么如何去相应？就是把 watcher 添加到 data 的 dep 里面去
普通 watcher 实例化的时候就会执行 get，读取 vm.key 去收集依赖，渲染 watcher 实例化时候执行 updateComponent，内部再去收集

- 对于 computed watcher，只需要设置 this.dirty = true，这样可以保证模板读取这个属性时会重新执行 evaluate
- 对于 render watcher 和 user watcher，一般使用异步模式，加入到 queueWatcher 队列，统一使用 nextTick 更新
- render watcher 更新就是执行 watcher.get() 触发 updateComponent 进行 patch 流程
- user watcher 会给 cb 传入 value，由开发者决定执行什么逻辑

#### flushSchedulerQueue
执行队列 watcher 更新，这里有几个重要的步骤
为啥会有顺序呢，因为 vue 在 _init 里执行 initState、initComputed、和 initWatch，所以这两个 watcher 都在 render watcher 之前创建

- 排序，确保 watcher 的执行按照 id 顺序，从小到大，也就是从父组件到子组件，user watcher 先于 render watcher
- 执行完成后要 resetSchedulerState 恢复状态
- 还要对 render watcher 执行 updated 生命周期

#### cleanupDeps
这个非常重要，每次执行 watcher.get() 后要清除旧的依赖
因为每次渲染过程对 data 或者 props 的读取都会进行新一轮的依赖收集，而一个 render watcher 可能会放到多个属性的 dep 里
但是我们模板中是存在条件判断的，条件变了可能会让某些属性不再被使用
这时候如果没有清除旧的依赖，对失效属性的 set 依然会造成 render watcher 的更新，这显然是没必要的！！

- 初始阶段：首先是 _init 触发的 initState，里面会收集 computed 和 user watcher，然后开始 $mount 收集 render watcher
- 变更阶段：属性变化触发 render watcher 更新，遇到组件实例化重复上面的过程，非组件 patch 时候收集 render watcher
- 所以每次变更都会重新进行依赖收集，在 watcher.get 中 cleanupDeps 清除旧依赖是合理的做法

#### computed watcher
入口在 src/instance/state.js 下的 initComputed，分为两步：1.创建 watcher 传入依赖属性表达式，2.defineReactive 定义属性 key
核心是建立 render watcher - computed watcher - 依赖属性的关系网
lazy 模式，watcher.evaluate 和 watcher.depend 都是专门给它使用的

- evalute 的执行一定是在读取 computedGetter 时候
- 依赖属性变化触发的 update 只会把 dirty 设置为 true
- computed key 的 getter 不会收集依赖，只是从 computed watcher 中取值

#### nextTick
异步执行，尽量使用微循环队列，当前版本的优先级顺序如下：Promise - MutationObserver - setImmediate - setTimeout

- 这里处理方式与 queueWatcher 一样，并不是每次调用就往 event queue 中扔一个函数，因为这个行为是不可控的
- 内部保存一个 callbacks，只通过 timeFunc 挂载 flushCallbacks
- 也就是说尽量让变化因素在我们的代码里控制，不要交给浏览器，这与共享帧动画是一样的意思，值得学习

#### 无法 observe 的情况
数组索引直接修改，新的属性扩展这种在普通情况下是无效的
Vue 通过巧妙的利用 dep，解决这个问题

- src/core/instance/observer/array.js，魔改 Array.prototype
- Vue.set，这个方法利用了 ob.dp.notify() 触发了 render watcher 的更新
- ob.dp 是啥？当使用 observe 监听对象时候，会 new Observer(value)，同时设置 value.__ob__ = this
- 可以理解为对象级别的依赖，如果 defineReactive 的 value 是一个对象，那么会做深度的递归 ob = observe(value)
- watcher get 时候，如果存在 value ob，那么会执行 ob.dep.depend() 收集依赖，这里和属性一样都是同一个 render watcher
- Vue.set 会获取 value.__ob__ 也就是 ob，然后执行 ob.dp.notify()，触发更新

#### 思考
vue 的 diff 是精准更新，我们来看看这个过程比 react 优化在什么地方

- 父组件触发了 update，这时候会进行 vnode patch，还有 children vnode 的 patch
- 当新旧 vnode 类型一致时，会进入 patchVnode，在这里面又会执行 prepatch
- prepatch 会把旧的组件 instance 赋给新 vnode，然后执行 updateChildComponent
- updateChildComponent 里面会把父组件已经变化的 propsData 拿到，给子组件 instance 的 vm._props 赋值
- 我们知道 initState - initProps 的时候会把 $options.props 进行 defineReactive 并放到 vm._props 上
- 那么当执行 vm._props 属性 setter 时候，就会触发子组件的 render watcher！！
- 结论很明显，vue 只有子组件使用了 props 时候，并且 props 变化了，才会触发子组件的更新（传给子组件的 props 就是编译出的 render function 的参数）
- 反观 react setState 时候无法知道哪些数据变化了，只能触发整个 vdom 的 diff，子组件内是需要开发者自己 scu 优化的

### 组件更新
- 新旧相同，属于更新逻辑 pattchVnode - prepatch - updateChildComponent
- 新旧不同，新建 - destroe 旧的，insert 新的
- oldStart、oldEnd、newStart、newEnd

#### props
首先 $options.props 是我们对 pros 类型的定义
真正的 props data 是 render function 时传入，保存在组件 vnode 的 componentOptions 对象里

- 初始化 initProps，这里不用赘述了，建立响应式，创建内部 _props，代理 key 到 this
- diff 如果判断是相同类型的组件 vnode，会复用 instance，同时将新的 props data 向 _props 赋值，触发子组件的 render watcher

vue 会对 props 做诸如 代理、validate、required、function、驼峰转化这样的处理，以后在工程中遇到具体用法再看
这也体现出 vue 很注重用户的开发体验，跟用户数据相关的操作会提供很多的保障和降级机制

- 一个优化是 validateProp 对格式和类型的处理
- 还有 getPropDefaultValue 缓存旧值，避免 setter 触发不必要的更新

#### updateChildComponent
vue 对相同类型的 vnode，会复用 vnode.componentInstance
通过将新的 props data set 到 componentInstance._props 上，触发 props key 的 setter，同时触发相关 watcher 的更新

#### 一个嵌套组件的初始化
fieldset - createChildren - createElm - (with)$withVnode - createComponent（fileset） - init - withInstance - mount
- render - select($selectVnode) - patch - createComponent - init - selectInstance - mount - render - patch - elm

withInstance._vnode = withComponentVnode
withInstance.$vnode = $withVnode

selectInstance._vnode = [div.select]
selectInstance.$vnode = $selectVnode

$selectVnode.parent = $withVnode
[div.select].parent = $selectVnode