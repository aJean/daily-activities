import React, { useState, useEffect } from 'react';
import { IDisplayComponentProps, ICanvasProps } from '../../../src/DragMode'
import { InfoCircleOutlined, CaretDownOutlined, CaretUpOutlined, CloseCircleOutlined } from '@ant-design/icons'
import styles from './index.css';

const NodeCard: React.FC<IDisplayComponentProps> = (props) => {
  const { data, refreshCanvas, globalVars } = props;
  const { type, label, data: nodeInfo } = data;
  const [isFolded, toggleIsFolded] = useState(false)
  useEffect(() => {
    refreshCanvas()
  }, [isFolded])

  return (
    <div
      className={styles['node-card']}
    >
      <h4 className={`flow-node-drag ${styles['flow-node-drag']}`}>
        <span onClick={() => toggleIsFolded(!isFolded)}>
          { label }
          { isFolded ? (
          <CaretUpOutlined
            className={styles['fold-icon']}
          />
        ): (
          <CaretDownOutlined
            className={styles['fold-icon']}
        />
        )}
        </span>

      </h4>
      <div className={`${styles['info-cell']} ${styles['info-cell-green']}`}>
        <div className={styles['card-body']}>
          <div className={styles['card-title']}>
            <InfoCircleOutlined />
            <span className={styles['title']}>基本信息</span>
          </div>
          <div className={styles['card-main']}>
            <div>节点名称: {nodeInfo?.name}</div>
            <div>处理模式: {nodeInfo?.dealType}</div>
          </div>
        </div>
      </div>
      {isFolded && (
        <>
          <div className={`${styles['info-cell']} ${styles['info-cell-blue']}`}>
            <div className={styles['card-body']}>
              <div className={styles['card-title']}>
                <InfoCircleOutlined />
                <span className={styles['title']}>类型设置</span>
              </div>
              <div className={styles['card-main']}>
                <div>知会人类型: {nodeInfo?.informerType}</div>
                <div>处理人类型: {nodeInfo?.handlerType}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NodeCard
