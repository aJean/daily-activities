/**
 * 项目布局文件
 * 约定布局统一维护在 src/layouts 目录下。
 */

import React from 'react';

export default function Layout({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <div>
      {children}
    </div>
  );
}
