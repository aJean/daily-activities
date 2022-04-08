import React from 'react';
import { Context } from '../../contexts';

interface IProps {
  color?: string;
  full?: boolean;
  width?: number;
  height?: number;
}

export const LineX: React.FC<IProps> = (props) => {
  const { color, full, height=2 } = props;

  return (
    <Context.Consumer>
      {value =>
        <div
          style={{
            backgroundColor: `${color || value.lineColor}`,
            height,
            width: `${full ? '100%' : value.spaceX + 'px'}`,
          }}
        />
      }
    </Context.Consumer>
  )
};

export const LineY: React.FC<IProps> = (props) => {
  const { color, full, width=2 } = props;

  return (
    <Context.Consumer>
      {value =>
        <div
          style={{
            backgroundColor: `${color || value.lineColor}`,
            width,
            height: `${full ? '100%' : value.spaceY + 'px'}`,
          }}
        />
      }
    </Context.Consumer>
  )
};
