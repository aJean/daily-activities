/**
 * 项目的 HTML 模板
 * 框架约定通过 document.tsx 的方式定制 HTML
 */

import React from 'react';
import { Document, Html, Head } from '@ies/ace';

export default (): JSX.Element => (
  <Document>
    <Html>
      <Head>
        <meta charSet="UTF-8" />
        <title>My title</title>
      </Head>
    </Html>
  </Document>
);
