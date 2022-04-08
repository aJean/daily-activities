/*
 * 项目构建配置文件
 */

import { defineConfig } from '@ies/ace';

export default defineConfig({
  /**
  * 定义项目的目标运行时平台
  * PC 场景默认的 browserlist 查询为 IE 11, > 0.5%, not dead
  */
  runtimeTarget: 'PCLegacy',
  output: {
    publicPath: process.env.NODE_ENV === 'production' ? '_internal_public_path_' : '/',
  },
});
