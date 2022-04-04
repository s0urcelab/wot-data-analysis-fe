import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd';

import styles from './index.less';

const Field = ({ label, value, ...rest }) => (
  <div className={styles.field} {...rest}>
    <span className={styles.label}>{label}</span>
    <span className={styles.number}>{value}</span>
    <Tooltip className={styles.tooltip} title="每天 12:00 拉取昨日数据">
      <InfoCircleOutlined />
    </Tooltip>
  </div>
);

export default Field;
