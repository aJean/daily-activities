import React from 'react';
import { Button } from 'antd'
import { IRegisterNode } from '../../types'

interface IPanelProps {
  defaultData: IRegisterNode[];
  onDragStart: (e: any, type: string) => void
}

const Panel: React.FC<IPanelProps> = (props) => {
  const { onDragStart, defaultData } = props;
  return (
    <>
      {defaultData.map((node: IRegisterNode) => {
        const { type, label } = node;
        return (
          <Button
            key={type}
            type="dashed"
            className={`panel node ${type}`}
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            style={{width: '50%', margin: 20, borderRadius: 5 }}
          >
            { label }
          </Button>
        )
      })}
    </>
  )
};

export default Panel;
