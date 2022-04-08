import React from 'react';
import { IDisplayComponentProps } from '../../types'
import styles from './index.css';


const DefaultNodeDisplay: React.FC<IDisplayComponentProps> = (props) => {
  const { data } = props
  const { label } = data
  return (
    <>
      <div
        className={styles['default-node-display']}
      >
        <h3>{label}</h3>
        <div className={styles['default-node-drag-area']}>可拖动区域</div>
        <div className={`flow-node-drag ${styles['default-node-create-line-area']}`}>可连线区域</div>
      </div>
    </>
  )
}

export default DefaultNodeDisplay
