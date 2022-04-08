import React, { useState, useEffect } from 'react';
import { IDisplayComponentProps } from '../../../src/DragMode'
import { InfoCircleOutlined, CaretDownOutlined, CaretUpOutlined, CloseCircleOutlined } from '@ant-design/icons'
import styles from './index.css';

const TriggerCard: React.FC<IDisplayComponentProps> = (props) => {
  const { data, refreshCanvas } = props;
  const { id, label, data: nodeInfo } = data;
  const [isFolded, toggleIsFolded] = useState(false)

  useEffect(() => {
    refreshCanvas()
  }, [isFolded])

  return (
    <div
      className={styles['node-card']}
    >
      <h4 className={`flow-node-drag ${styles['flow-node-drag']}`}>
        <span onClick={() => {toggleIsFolded(!isFolded)}}>
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
        {/* <span className={styles['close-icon']} onClick={(ev) => handleDelete(id)}>
          <CloseCircleOutlined />
        </span> */}

      </h4>
      <div className={`${styles['info-cell']} ${styles['info-cell-blue']}`}>
        <div className={styles['card-body']}>
          <div className={styles['card-title']}>
            <InfoCircleOutlined />
            <span className={styles['title']}>基本信息</span>
          </div>
          <div className={styles['card-main']}>
            <div>动作名称: {nodeInfo?.actionName}</div>
            <div>状态开关: {nodeInfo?.status}</div>
          </div>
        </div>
      </div>
      {isFolded && (
        <>
          <div className={`${styles['info-cell']} ${styles['info-cell-orange']}`}>
            <div className={styles['card-body']}>
              <div className={styles['card-title']}>
                <InfoCircleOutlined />
                <span className={styles['title']}>触发条件</span>
              </div>
              <div className={styles['card-main']}>
                <div>{nodeInfo?.rules}</div>
              </div>
            </div>
          </div>
          <div className={`${styles['info-cell']} ${styles['info-cell-green']}`}>
            <div className={styles['card-body']}>
              <div className={styles['card-title']}>
                <InfoCircleOutlined />
                <span className={styles['title']}>执行动作</span>
              </div>
              <div className={styles['card-main']}>
                <div>{nodeInfo?.actions}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TriggerCard
