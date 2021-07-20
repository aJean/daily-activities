import React from 'react';
import { createApp, CreateAppConfig, AppInstance } from '@medlinker/fundamental';
import { plugin, PluginType } from 'mdf';

/**
 * @file plugin-fundamental-app
 */

type Instance = {
  getAppElement?: Function;
};
export default function(opts: CreateAppConfig) {
  const app: AppInstance & Instance = createApp(plugin.invoke({
    key: 'appOpts',
    type: PluginType.modify,
    initValue: opts,
  }));
  
  // @ts-ignore
  app.getAppElement = () => plugin.invoke({
    key: 'appElement',
    type: PluginType.modify,
    initValue: React.createElement(app['App']),
  });

  // 这里可以注册 modles
  {{{ RegisterModels }}}

  return app;
}