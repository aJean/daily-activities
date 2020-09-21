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

#### entry-runtime-with-compiler 做了什么
- 首先找到 template，这里可以自己传 string 或者 dom node，再或者直接使用 el 的 outHtml，都没传就等着报异常吧
- 通过 compileToFunctions 生成 $options.render 和 $options.staticRenderFns，就是 vue-loader 做的事情
- 然后执行 Vue.prototype.$mount 之后就是一致的流程了

#### mountComponent
- 首先找 $options.render，如果没有只能创建 emptyVnode
- 生成 updateComponent 函数
- 创建渲染 watcher，传入 updateComponent，注意只有一个 render watcher 并且会存在 vm._watcher 上面，$forceUpdate 时候也会使用
- 因为创建 watcher 时就会执行 get - getter - updateComponent，所以这里界面就渲染了
- 执行 mount 生命周期
```javascript
// 渲染 watcher 的 getter 就是 updateComponent，这样一调用 watcher.get() 就会渲染界面
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

#### vm._render
主要代码在 src/core/instance/render.js
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


#### vm._updatefor
将 vnode 渲染到页面，内部会调用 vm.__patch__，__patch__ 方法是 platforms 下面实现的，比如 src/platforms/web/runtime/patch
- patch 主要是处理 dom 操作，里面会有两个集合，一个是所有 dom 操作方法，一个是对 dom 属性的 hooks
- createPatchFunction 使用传入的集合初始化一些钩子，因为 snabbdom 在 patch 过程中会执行不同阶段的钩子，这里是建立联系
- 最终我们执行的是 src/core/vdom/patch.js，这样设计是将与平台相关的操作隔离出去，core 里面只处理通用逻辑，同理 react 的 renderer
```javascript
export const patch: Function = createPatchFunction({ nodeOps, modules })
```