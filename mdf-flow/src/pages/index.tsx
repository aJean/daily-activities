import { FC, useEffect } from 'react';
import { RouteComponentProps } from '@ies/ace';
import { jsPlumb } from 'jsplumb';
import Style from './index.modules.scss';
import NodeStyle from '../components/node/node.modules.scss';

/**
 * @file 页面
 */

const Page: FC<RouteComponentProps> = () => {
  const jp = jsPlumb.getInstance();
  jp.importDefaults({
    Connector: ['Straight', { curviness: 150 }],
    Anchors: ['BottomCenter', 'TopCenter'],
    connectorHoverStyle: {
      outlineStroke: 'green',
      strokeWidth: 2
    }
  });

  useEffect(() => {
    jp.reset();
    jp.connect({
      source: 'node1',
      target: 'node2',
      endpoint: 'Blank',
      overlays: [
        [
          'Custom',
          {
            create: function (component: any) {
              console.log(component);
              return document.createElement('span');
            },
            location: 0.7,
            id: 'customOverlay'
          }
        ]
      ]
    });
  }, []);

  return (
    <div className={Style.canvas}>
      <div id='node1' className={NodeStyle.node}></div>
      <div id='node2' className={NodeStyle.node}></div>
    </div>
  );
};

export default Page;
