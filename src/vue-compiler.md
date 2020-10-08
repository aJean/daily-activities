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