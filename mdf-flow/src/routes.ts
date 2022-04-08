/**
 * 项目路由配置文件
 * 推荐使用配置式路由管理项目的路由信息，只需要按照路由协议进行配置即可
 */

import { IRoutes } from '@ies/ace';

const routes: IRoutes = [
  {
    path: '/free',
    component: '@/pages/index',
  },
  {
    path: '/test',
    component: '@/pages/uitest/index',
  }
];

export default routes;
