/** 
 * 项目入口文件
 * 框架内置对 React 渲染流程进行了抽象，无需要手动调用 ReactDOM.render，只需导出 App 根组件即可
 */

import { IApp } from '@ies/ace';

/**
 * App 组件为项目的根组件
 * Component 属性默认为页面的最外层路由组件
 * 可以在 Component 外层添加公共组件（比如 Layout、Provider 等
 */
const App: IApp = ({ Component }) => (
  <Component />
);
export default App;
