### 配置
Vue 有两种配置，config、options，都可以做全局设置

#### options
Vue.options 会 在 _init 的 mergeOptions 的时候与组件 options 合并，并传给组件的构造器
- 资产配置，components 注册组件、filters 过滤器、directives 指令
- 延伸一下，directive 用于处理 dom 行为、filters 用于处理属性值

#### config
全局配置，这个不会传给组件，会被内部的方法使用
- 比如 config.errorHandle 被 core/util/error.js 的 handleError 使用
- 而 handleError 就是 vue 处理异常的通用方法，handleError(e, vm, `render`)

### 编译
两个通用的东西从流程中抽离
- baseOptions 针对不同平台的配置
- baseCompile 核心编译器

#### 架构设计
在设计上 core 与 platforms 是分离的
这样针对 vdom 这种通用数据结果的处理，都可以放在 core 里面，因为这部分是不变的
但是宿主环境的配置以及 api，应该由 platforms 提供
- 问题是 createPatchFunction、createCompilerCreator 都是内部 api，开发者必须 fork vue 的源码，才能做自己的修改
- vue3 的 custom render 进一步将对架构升级，可以像 'react-reconciler' 一样灵活使用

### vue-router
通过 Vue.use 以插件方式载入

#### record
内部记录对象，就是把我们传给 VueRouter 的 routes，全部转化为内部的 record
存放在 pathList、pathMap、nameMap

#### route
通过 matcher.match 匹配计算得到
会包装成 _createRoute 内部 route 对象
matched 属性是一个数组，保存了路径上的所有 record

#### 设计
实现一个路由需要三个模块
- history 管理，对应到 vue-router 里就是 html5、hash、abstract
- 路由注册，就是建立 path - handler 的关系，把我们定义的路由注册到系统中
- 路由触发，触发 path 的变化，通知 history 做路由切换
- current 记录当前的 route，match 匹配内部的 route

### vuex
全局的状态管理，包括 state 声明、action 业务逻辑处理、 mutation 追踪