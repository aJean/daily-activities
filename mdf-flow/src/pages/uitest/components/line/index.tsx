import React from 'react';

/**
 * @file 画线
 */

interface IProps {
  color?: string;
  full?: boolean;
  width?: number;
  height?: number;
}

export const LineX: React.FC<IProps> = () => {
  return (
    <div
      style={{
        backgroundColor: '#666',
        height: 2,
        width: '100%'
      }}
    />
  );
};

export const LineY: React.FC<IProps> = () => {
  return (
    <div
      style={{
        backgroundColor: '#666',
        width: 2,
        height: '16px'
      }}
    />
  );
};
