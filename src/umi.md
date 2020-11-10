### umi 工作流
纵向执行一个一个的插件，横向流水线最终生成配置 并build 出开发文件
1. 解析源码，读取 .umirc.ts 或 config/config.ts 中的配置
2. 进入流水线生命周期，执行插件，创建临时文件夹 src/.umi
3. 生成入口文件、路由配置文件、编译配置文件、插件等，入口文件会加载 routes，执行渲染与 hmr
4. 执行 build，生成编译产物
5. dev 运行编译产物

```shell
+ .umi
  + core     # 内部插件生成
  + pluginA  # 外部插件生成
  + presetB  # 外部插件生成
  + umi.ts   # 入口文件
```

#### 插件体系
umi 有非常强大的插件系统，开发者可以自己定制 node 插件或者 runtime 插件
- 运行时插件
- 构建时插件
- 编辑时插件（umi ui）

-------------------------------

### 生命周期
- 前置任务，在做所有事之前，onStart
- 更新全局配置，Service.js#constructor，_modifyGlobalConfig
- 修改路由配置，getRouteConfig.js#default，modifyRoutes
- 修改配置插件，modifyConfigPlugins
- 生成 .umi 下的文件，generateFiles
- modifyPageWatchers
- 修改路由文件，modifyRouterFile
- 修改入口文件 umi.js，modifyEntryFile
- 修改路由文件里 component 的定义，区分 development 和 production，modifyRouteComponent
- 修改传给 webpack/getConfig 的参数，modifyWebpackOpts
- 修改 webpack config，modifyWebpackConfig
- 修改 HTML 文件，modifyHTML
- 修改 HTML 的 script 部分，modifyHTMLScript
- build 成功后，buildSuccess

#### dev 专用
- modifyMiddlewares
- 路由被请求时做的事，onRouteRequest
- afterServer
- beforeServer
- onCompileDone

-------------------------------

### 运行时配置
对 dva 或 js 运行造成影响的配置，src/app.ts
- patchRoutes、rootContainer、render、onRouteChange、dva
- 也可以自己再定义~

### 插件 api
不仅仅是 life circle hooks，还有很多 utils，方便用户进行 2次 开发
- 比如 addUmiExports、writeTmpFile、registerCommand、addProjectFirstLibraries、addTmpGenerateWatcherPaths

#### 代码
- 运行时插件：umi/packages/runtime/src/Plugin/Plugin.ts
- node 插件：umi/packages/core/Service/Service.ts

#### 插件注册
- api.register 注册编译期的插件，可以指定 key
- api.addRuntimePlugin 注册运行时插件，可以再通过 addRuntimePluginKey 注册 key，key 会关联 export
- validKeys 就是 addRuntimePluginKey 注册的所有 key，运行时插件必须 export validKeys 注册的属性
- 运行时插件集中在 src/.umi/core/plugin.ts 内，创建 plugin 对象
- plugin 对象会加载所有注册的运行时插件，执行的时通过 export key 去查找
- 运行时 ApplyPluginsType.compose vs 编译时 ApplyPluginsType.add

```javascript
// preset-built-in/src/plugins/generateFiles/core/plugin.ts 负责运行时的插件组装，生成 .umi/core/plugin.ts
// 收集 validKeys
const validKeys = await api.applyPlugins({
  key: 'addRuntimePluginKey',
  type: api.ApplyPluginsType.add,
  initialValue: ['patchRoutes', 'rootContainer', 'render', 'onRouteChange'],
});


// umi/packages/runtime/plugin/plugin.ts
register(plugin: IPlugin) {
  // 遍历 require('/Users/kenzoss/Sites/primary-user-growth-h5/src/app.ts') 的 export key
  Object.keys(plugin.apply).forEach((key) => {
    assert(
      this.validKeys.indexOf(key) > -1,
      `register failed, invalid key ${key} from plugin ${plugin.path}.`,
    );
    if (!this.hooks[key]) this.hooks[key] = [];
    this.hooks[key] = this.hooks[key].concat(plugin.apply[key]);
  });
}
```

#### 插件执行策略
可以看出对于不同的插件，umi 采用不同的策略
- rootContainer 与 dva 是 modify 模式，即对 component or config 进行 wrap & merge，使用最后一个插件返回的结果
- render 是 compose 中间件模式，让用户有机会在 renderClient 前后做一些 aop 的事情
- patchRoutes 与 onRouteChange 都是 event handler 处理，对 routes 进行动态的定制
- add 模式只在注册期可以使用，将所有结果合并返回

#### init history plugin
umi2 的插件机制有点一不样
generateHistory 是放在 umi-build-dev 里面处理的
直接使用 modifyEntryHistory 去修改 history 配置吧

-------------------------------

### umi config
不论是 .umirc.ts，还是 config 目录， 最终的目的只有一个，生成 webpack config 进行代码的构建

#### getBundleAndConfigs
源码在 umi/packages/preset-built-in/src/plugins/commands/buildDevUtils.ts
调用在 preset-built-in/plugins/commands 的 dev 和 build，用于生成 bundle 对象和 config
- getBundleAndConfigs - buildDevUtils - Bundler - getConfig
- Bundler 就是 umi/packages/bundler-webpack，是对 webpack node api 的封装
- 首先用 core/service 里面收集到的 .umirc 进行 Bundler 实例化
- 执行 getConfig - bundle.getConfig，使用初始配置结合插件各自的配置，生成 webpack config
- 传给 bundle.getConfig 的 getConfigOpts 由多个部分组成，这里会提供执行内部插件的方法，比如 modifyBabelPresetOpts
- bundle.getConfig 会使用 webpack-chain 创建 config 对象，执行 getConfigOpts 的插件勾子，触发内部插件挂载的方法
- 返回 bundler, bundleConfigs, bundleImplementor 给 dev 或者 build 使用

#### 修改配置的 hook
体现了 umi 的 config 收集机制
- core/config/ 收集 env、.umirc、和插件的 describe
- core/service/ modifyConfig 修改 .umirc 里面的初始配置
- buildDevUtils/ modifyBundleConfigOpts 修改传给 webpack-chain 之前的参数
- buildDevUtils/ modifyBabelOpts吗，插件修改 babel
- buildDevUtils/ modifyBabelPresetOpts，插件修改 babel preset
- chainWebpack，插件修改 webpack config
- modifyBundleConfig 修改 toConfig() 拿到的 webpack config json obj

#### Bundle
基于 webpack 封装的 Bundle 类
umi 提供了 modifyBundler 类型的插件，插件对其进行扩展

-------------------------------

### plugin-dva
主要作用是注册 models 与 routes，配置 hmr 和 immr
- 创建配置描述信息，用于 defineConfig
- 进入 onGenerateFiles 生命周期，查找 models
- 使用插件模板创建相应的临时文件
   - dva.ts，import dva、创建全局 dva 对象、注册用户 models 并 创建 _DvaContainer
   - runtime.ts，创建运行时配置 rootContainer
   - connect.ts，导出所有用户 models（dvaHeadExport） 以及一些接口声明
   - exports.ts，导出 dva 工具方法以及全局 dva 对象
- 使用 addRuntimePlugin 注册 runtime.ts，这样在执行 renderClient 时可以将 _DvaContainer 插入组件树
   - 最终 rootContainer 层级 user container - _DvaContainer - routs
- 使用 api.addTmpGenerateWatcherPaths 监听 src/models 目录
- 使用 api.addProjectFirstLibraries 优先加载用户环境的 dva 依赖，如果没有使用内置
- 使用 modifyBabelOpts 修改 babel 配置，根据用户传入的 config.dva 决定是否使用 hmr
- 使用 addRuntimePluginKey 注册 key dav，让用户在 app.ts 里可以对 dva 进行配置
- 使用 addUmiExports 将 exports 与 connect 导出到用户环境
- 使用 registerCommand 注册 umi dva 命令

```javascript
// export const dva，收集用户定义的 dva 参数，定义在 plugin-dva/src/dva.tpl
const runtimeDva = plugin.applyPlugins({
  key: 'dva',
  type: ApplyPluginsType.modify,
  initialValue: {},
});

// export function patchRoutes，触发是在 src/.umi/core/routes.ts
// 在生成路由配置后给用户去修改路由的机会
plugin.applyPlugins({
  key: 'patchRoutes',
  type: ApplyPluginsType.event,
  args: { routes },
});

// export function onRouteChange，定义在 @umijs/remder-react/dist/index.js
// 事件插件在 RouterComponent 里 useEffect 会执行，也就是说每次 history 改变都会执行一遍
props.plugin.applyPlugins({
  key: 'onRouteChange',
  type: runtime.ApplyPluginsType.event,
  args: {
    routes: props.routes,
    matchedRoutes: matchedRoutes,
    location: location,
    action: action
  }
});

// export function render，定义在 src/.umi/umi.ts
plugin.applyPlugins({
  key: 'render',
  type: ApplyPluginsType.compose,
  initialValue: () => {
    return renderClient({
      routes: require('./core/routes').routes,
      plugin,
      history: createHistory(args.hot),
      rootElement: 'root',
      defaultTitle: '',
    });
  },
  args,
})

// 拿到所有注册的运行时 plugin，umi/packages/preset-built-in/src/plugins/generateFiles/core/plugin.ts
const plugins = await api.applyPlugins({
  key: 'addRuntimePlugin',
  type: api.ApplyPluginsType.add,
  initialValue: [
    getFile({
      base: paths.absSrcPath!,
      fileNameWithoutExt: 'app',
      type: 'javascript',
    })?.path,
  ].filter(Boolean),
});

// 实际的渲染执行函数，定义在 @umijs/remder-react/dist/index.js
function renderClient(opts) {
  // 此时 rootContainer 已经 wrap 了 _DvaContainer
  var rootContainer = opts.plugin.applyPlugins({
    type: runtime.ApplyPluginsType.modify,
    key: 'rootContainer',
    // 这个是传给 _DvaContainer render 的 props.children，也就是 src/.umi/core/routes.ts
    // 会执行 app.router(() => this.props.children) 注册到 dva 上面
    initialValue: React__default.createElement(RouterComponent, {
      history: opts.history,
      routes: opts.routes,
      plugin: opts.plugin,
      ssrProps: opts.ssrProps,
      defaultTitle: opts.defaultTitle
    }),
    args: {
      history: opts.history,
      routes: opts.routes,
      plugin: opts.plugin
    }
  });

  if (opts.rootElement) {
    // rootElement 就是 id="root"
    var rootElement = typeof opts.rootElement === 'string' ? document.getElementById(opts.rootElement) : opts.rootElement;
    // 终于把我们的 app 渲染到 dom 中
    ReactDOM[!!opts.ssrProps ? 'hydrate' : 'render'](rootContainer, rootElement);
  } else {
    return rootContainer;
  }
```

#### 相关配置
defineConfig 中针对 dva 的配置主要有两个 hmr、immer
- hmr 这个上面已经说过了，在插件执行时通过 modifyBabelOpts 设置
- immer 会在 dva.ts 里面以中间件的形式加载

```javascript
  // src/.uni/plugin-dva/dva.ts
  app.use(createLoading());
  app.use(require('/Users/kenzoss/Sites/primary-user-growth-h5/node_modules/dva-immer/dist/index.js')());
```

#### model 语法验证
主要是验证属性，依然是通过 ast parse + travel 的方式
```javascript
t.isObjectExpression(node) && node.properties.some(property => {
  return [
    'state',
    'reducers',
    'subscriptions',
    'effects',
    'namespace',
  ].includes((property as any).key.name);
```

#### 如何确定渲染元素
插件之间相互隔离，render element 只有在运行时才确定，方案就是将 contaner 缓存，在运行时组合起来渲染
在 plugin-dva/dva.ts 里面的 _DvaContainer 并不知道要渲染到哪里，所以它执行 dva.start 时没有传 selector
根据 dva 源码，如果没有传入 selector，只返回 react jsx 对象
- 将 plugin-dva/runtime.tsx 注册为运行时插件，key 是 rootContainer
- 在 umi.ts 执行 renderClient 的时候 apply rootContainer 插件，将返回值作为 rootContainer
- 创建 router component 作为 rootContainer 的 initValue，将收集的 history、routes 配置作为 props
- 最后执行 ReactDOM.render(rootContainer, rootElement)，rootElement: 'root' 也就是渲染容器

```javascript
// dva.start
function start(container) {
  // 根据container找到对应的DOM节点
  if (!app._store) oldAppStart.call(app); // 执行内部 start，主要是处理 effects 创建 store
  const store = app._store;

  // 为HMR暴露_getProvider接口
  app._getProvider = getProvider.bind(null, store, app);
  // If has container, render; else, return react component
  if (container) {
    render(container, store, app, app._router);
    app._plugin.apply('onHmr')(render.bind(null, container, store, app));
  } else {
    return getProvider(store, this, this._router);
  }
}

// plugin-dva _DvaContainer.render
render() {
  const app = getApp();
  // 注册项目的 routes，根据 pages 或者配置生成
  app.router(() => this.props.children);
  // 这里是执行 getProvider 的返回函数，最终返回的就是 react component
  return app.start()();
}
```

#### 动态导入
为什么使用 addUmiExports api 新导入的模块，要在 umi dev 执行后才可以被 ts 识别 ?
- tsconfig.json 里定义了 paths
- 动态的模块会被写入 src/.umi/core/umiExports.ts
- node_modules/umi 里面会导出 @@/core/umiExports
- 所以新模块第一次导入需要 run dev，主要是在插件执行时把 module url link 到 umiExports.ts 里面

```javascript
// umijs/packages/umi/index.js
let ex = require('./lib/cjs');
try {
  const umiExports = require('@@/core/umiExports');
  ex = Object.assign(ex, umiExports);
} catch (e) {}
module.exports = ex;
```

-------------------------------

### plugin-model
简易数据流，通常用于中台项目的全局共享数据，以 hook 方式提供
与 plugin-dva 共用约定文件，比如 src/models、src/pages/model...
- 通过 onGenerateFiles 生命周期收集文件、配置生成 src/.umi/plugin-model
- 使用 addRuntimePlugin 注册 runtime.ts，以 rootContainer 配置的形式提供 provider
- 使用 addUmiExports 把 useModel.ts 导出到 src/.umi/core/umiExports.ts
- 使用 addTmpGenerateWatcherPaths 监视 src/models 目录

#### hook 验证
确保 export default 的是 function，这也是对用户语法的验证方式值得借鉴
- getModels 遍历所有文件，执行 getValidFiles 验证，将 js model 转为 ast
- travel ast enter，判断 isExportDefaultDeclaration 是否 ArrowFunctionExpression 或者 FunctionDeclaration
- 如果是 export default Identifier，再进入内部深度查询，找到 identifierName 然后判断是否 function
- 将返回的 files 传给 getTmpFile，结合模板最终生成 providerContent 与 useModelContent
- 把 content 写入相应的文件

```javascript
  const files = getAllModels();
  // 收集内部插件定义的 models，这里不会再做 getValidFiles 验证，所以要自己保证语法是正确的
  const additionalModels = await api.applyPlugins({
    key: 'addExtraModels',
    type: api.ApplyPluginsType.add,
    initialValue: [],
  });

  const tmpFiles = getTmpFile(files, additionalModels);

  // provider.tsx
  api.writeTmpFile({
    path: `${DIR_NAME_IN_TMP}/Provider.tsx`,
    content: tmpFiles.providerContent,
  });

  // useModel.tsx
  api.writeTmpFile({
    content: tmpFiles.useModelContent,
    path: `${DIR_NAME_IN_TMP}/useModel.tsx`,
  });

  // runtime.tsx
  api.writeTmpFile({
    path: 'plugin-model/runtime.tsx',
    content: utils.Mustache.render(
      readFileSync(join(__dirname, 'runtime.tsx.tpl'), 'utf-8'),
      {},
    ),
  });
```

#### 强约束
怎么理解，让用户编写的模块可以被 ts 识别，并且提供 intelligence 与检查
比如使用 useModle(name)，这个 name 必须是内部已经定义了的合法 model
- provider 会导出所有符合规则的 models 和 泛型模块定义 Model
- useModel 使用 Model 对参数进行约束

```javascript
// src/.umi/plugin-model/provider.ts
export const models = { '@@initialState': initialState, 'qytest': model0 }

export type Model<T extends keyof typeof models> = {
  [key in keyof typeof models]: ReturnType<typeof models[T]>;
};

// src/.umi/plugin-model/useModel.ts
import { Model, models } from './Provider';

export function useModel<T extends keyof Model<T>, U>(
  namespace: T,
  updater?: (model: Model<T>[T]) => U
) typeof updater extends undefined ? Model<T>[T] : ReturnType<NonNullable<typeof updater>> {
  ...
}
```

- defineConfig 配置约束（packages/umi/src/defineConfig.ts）
```javascript
import { IConfigFromPlugins } from '@@/core/pluginConfig';

// api.describe 通过 jni 约束的配置会写入 .umi/core/pluginConfig.d.ts
// 所以插件里面定义的配置，都可以在这里被 typescript 找到
export function defineConfig(
  config: IConfigFromPlugins | IConfig,
): IConfigFromPlugins | IConfig {
  return config;
}
```

-------------------------------

### 路由
很多插件都会扫描 src/pages 目录，但是生成路由的代码却不在这里
- 路由的处理是由 umi/packages/core/src/Route/Route.ts 负责的
- 其原则是优先 config 配置，然后是约定路由收集（src/pages、src/layouts）

```javascript
let routes = lodash.cloneDeep(config.routes);
if (!routes) {
  // root == src/pages
  routes = this.getConventionRoutes({
    root: root!,
    config,
    componentPrefix,
  });
}
```

-------------------------------

### 思考
- applyPlugins register 实现与异步机制, umi/packages/core/src/Service/Service.ts
- addProjectFirstLibraries 如何做到优先读取用户环境依赖
- addTmpGenerateWatcherPaths 添加临时生成的监听路径
- getPluginAPI 通过 Proxy 实现一边注册一边获取使用 ??
- plugin-layout 的实现，如何与 antd Layout 结合
- plugin-request 的实现，是否可以用于我们的项目，如何用 adaptor 适配不同的后端服务接口，如何根据返回值做统一的错误提示

-------------------------------

### build 启动流程
./bin/umi -> umi/lib/cli.js -> umi/lib/serviceWithBuildin -> service.run('build') -> service.init() -> command/build.ts
源码在 packages/umi

#### serviceWithBuildin
- 继承 core/service，配置了插件集与插件
- 执行 counstructor，创建 BabelRegister、config、pathes
- 加载内部插件集 preset-built-in，又会加载其他内部插件比如 renderer-react
- 加载内部插件 ./plugins/umiAlias


#### service constructor
主要的工作是将外部传入的 presets 转化为 js 可识别格式
- 相关的工具方法在 core/service/pluginUtils.ts，关键是生成一个 apply 函数
```javascript
apply() {
  try {
    // absolute plugin file path
    const ret = require(path);
    return compatESModuleRequire(ret);
  } catch (e) {
    throw new Error(`Register ${type} ${path} failed, since ${e.message}`);
  }
}
```

#### service.run
运行内置命令，build、dev、dva 等
- await service.init，执行初始化
- 因为所有插件都先执行过了，所以我们在插件中配置的 registerCommand 在 run 的时候已经可以生效了
- 触发 onStart 事件
- 执行具体命令 runCommand，此时就会调用 preset-built-in/src/plugins/commands/build.ts 的代码

#### service.init
初始化工作，我们配置的插件的同步代码都是在这里执行的
- initPresetsAndPlugins，执行所有 插件集 与 插件的初始化，传入代理过的 api 对象
- 将以 plugin id 为存储维度的 hooksByPluginId 转化为以 key 存储的 hooks!!
- 执行一些修改 config 相关的 hook，生成 umi 的 config，我们插件里注册的 modifyConfig、modifyPaths 都会在这一步执行!!

#### build.ts
这个命令相对简单，只执行一次拿到结果就退出了
- generateFiles 执行插件的 onGenerateFiles 事件调用，生成临时文件
- 获取 bundle 和 webpackBundleConfig，执行 bundle.build 开始编译
- 触发 onBuildComplete 事件

#### api.modifyBundleConfig
此类方法在注册时都没有提供方法体，所以使用的是内部提供的 fn

```javascript
// core/PluginApi.ts
this.service.pluginMethods[name] =
  fn || function (fn: Function) {
    const hook = {
      key: name,
      ...(utils.lodash.isPlainObject(fn) ? fn : { fn }),
    };
    this.register(hook);
  };

// hook 全部添加到一个内部数组里
register(hook: IHook) {
  this.service.hooksByPluginId[this.id] = (
    this.service.hooksByPluginId[this.id] || []
  ).concat(hook);
}
```

#### service.getPluginAPI
每一个插件、插件集拿到的 api 对象是不同的，但 service 实例都是一个，所以注册都是注册到相同的 service 上
- plugin id 会保存在 PluginApi 对象上，对插件本身无感知
- 插件内部执行 api.register 都会注册到自己的 id 上
- 每个插件的 hook 都会保存在自己的 id 下，但是运行时候是以 key 来拉通运行的，这跟 runtimePlugin 行为一致

#### resolvePresets
将 presets path 处理为 preset obj，为每一个 preset 生成唯一 id
- 关键方法是 pathToObj：core/src/Service/utils/pluginUtils.ts 
- id 有什么用？ 首先同一个文件内的插件会保存在 hooksByPluginId[id] 这个 list 下
- id 是什么？可以宏观上认为就是 preset file path
- 然后 service.plugins 里面还会以 id 保存原始的 preset obj
- 执行 applyPlugins 的时候会使用 isPluginEnable 判断插件是否开启
- isPluginEnable 会使用 service.plugins，所以插件是以 id 为维度来判断的

#### service.hooksByPluginId
- 需要 applyPlugins 执行的插件都保存在 service.hooksByPluginId[pluginId] 里面
- 在初始化阶段收集结束之后会将 hooksByPluginId 映射到 hooks

```javascript
// service.init 时候执行
initPlugin(plugin: IPlugin) {
  // resolvePlugins 时会读取 plugin path，生成 plugin id
  const { id, key, apply } = plugin;
  // service instance 相同，所以注册信息都是同一个地方，因此这里需要传入 id 做区分
  const api = this.getPluginAPI({ id, key, service: this });

  // register before apply
  this.registerPlugin(plugin);
  apply()(api);
}
```

#### service.applyPlugins
这个方法是从 this.hooks 里面直接取 key，然后根据 type 策略执行的
- 但是 this.hooks 的初始化是在 service.init 里面，且只会执行一次
- 由此引出在插件里异步注册的 hook 全部没有效果，不会被执行

```javascript
async init() {
  this.setStage(ServiceStage.init);
  // 执行所有插件集与插件
  this.initPresetsAndPlugins();
  this.setStage(ServiceStage.initHooks);
  // 绑定 hooksByPluginId 到 hooks，因为执行 service.applyPlugins 时候是不知道 id 的，只有 key
  Object.keys(this.hooksByPluginId).forEach((id) => {
    const hooks = this.hooksByPluginId[id];
    hooks.forEach((hook) => {
      const { key } = hook;
      hook.pluginId = id;
      this.hooks[key] = (this.hooks[key] || []).concat(hook);
    });
  });
  ...
}
```

#### preset 和 plugin
从官方的代码来看 preset 是处理与构建功能相关的插件
而 plugin 是处理一些 webpack 配置 的插件，相对来说比较简单，比如 umiAlias
```javascript
export default (api: IApi) => {
  api.chainWebpack((memo) => {
    if (process.env.UMI_DIR) {
      memo.resolve.alias.set('umi', process.env.UMI_DIR);
    }
    return memo;
  });
};
```

#### registerCommand
- 把命令函数存储到 this.service.commands 数组中
- 在 runCommand 时取出来调用

#### registerMethod
注册一个方法，默认行为是提供一个便捷的插件注册调用，不需要传 key
很多插件都直接使用, 比如 onGenerateFiles、modifyBundleConfig
- preset-built-in/plugins/registerMethods.ts 里有非常多的便捷方法注册

```javascript
// 没有传 fn，那么走默认逻辑，生成一个便捷的注册 modifyConfig 插件的调用
api.registerCommand('modifyConfig');
// 执行插件注册
api.modifyConfig(memo => memo);
// 触发插件
api.applyPlugins({
  key: 'modifyConfig',
  type: this.ApplyPluginsType.modify,
})
```

#### addTmpGenerateWatcherPaths
这是监控文件夹的方法，内部通过 registerMethod 注册
- registerMethod 注册的方法如果没有传入 fn，就会生成一个默认的函数，然后在注册到 service.pluginMethods
- 通过 api 调用 method，内部 proxy 会查找到刚才注册的 fn，相当于一个不需要传 key 的 register
- 执行 addTmpGenerateWatcherPaths 把传入的 path fn 保存在 hooksByPluginId 里面
- generateFiles 里面会把里面的路径都拿出来创建 chokidar watcher，当有变化时会重新触发 onGenerateFiles

### umi dev
现在可以梳理一下最常用的 umi dev 命令的流程了
- ./bin/umi -> umi/lib/cli.js 
- 通过 fork 启动 ./forkedDev 进程，在里面创建 service 对象
- 执行 service.run('dev')，默认是 watch 模式，会对 config 注册 watch onChange
- 执行 generateFiles(watch)，触发 onGenerateFiles，同时会监听默认的开发目录
- 生成 bundleConfigs，启动 webpackDevMiddleware
- 启动 express server，处理 mock (packages/server/src/server.ts)
- 监听到文件变化时，如果 config 没变，直接触发 onGenerateFiles，由 webpackDevMiddleware 处理
- 如果 config 变了需要 reload，会执行 restartServer
- restartServer 当前进程发送 RESTART 信号，主进程监听到会杀死当前 dev 进程并重新启动一个 forkedDev
- 综合来看 umi 命令流由 node 多进程 + plugin + hook 三大块组成

```javascript
// preset-built-in/plugins/commands/dev/dev.ts
const unwatchConfig = api.service.configInstance.watch({
  userConfig: api.service.userConfig,
  // config.watch 会监听所有跟配置相关的目录文件，一旦变化就会执行 onChange
  onChange: onChange: async ({ pluginChanged, userConfig, valueChanged }) => {
    ...
    if (reload) {
      console.log();
      api.logger.info(`Config ${reloadConfigs.join(', ')} changed.`);
      api.restartServer();
    }
    ...
  }
})
// core/src/config/config.ts
watch(opts: {
  userConfig: object;
  onChange: (args: {
    userConfig: any;
    pluginChanged: IChanged[];
    valueChanged: IChanged[];
  }) => void;
}) {
  ...
  if (pluginChanged.length || valueChanged.length) {
    opts.onChange({
      userConfig: newUserConfig,
      pluginChanged,
      valueChanged,
    });
  }
  ...
}
```

### 再思考下 umi 的设计
主要有这三点：流水线、依赖前置、插件化

#### 流水线
基本流程就是 cli 命令 - 参数分析 - 加载插件 - 执行命令 - 触发生命周期 - bundle 构建
- dev 时就会有守护进程和目录监听
- build 就直接生成编译产物，就是这么简单

#### 依赖前置
所有插件、插件集都是在执行具体命令之前加载并初始化的
- 因为命令也是通过 api.registerCommand 再查件里面注册的
- 注意编译时插件和运行时插件，js 插件是在浏览器环境里注册执行的

#### 插件化
umi 内部也是基于它的插件体系做开发扩展的
- 微内核模式架构，core 定义骨架，功能全部由插件方式集成，相互解耦、扩展性强
- 可以看下 umi/packages/preset-built-in/plugins/generateFiles，都是对于 onGenerateFiles 事件的应用
- umi 把很多重要的生产逻辑都分离到了 plugins/generateFiles 中去处理，比如创建入口文件，生成 .umi/core 目录和文件