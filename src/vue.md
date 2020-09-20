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