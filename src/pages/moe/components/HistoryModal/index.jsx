import { useEffect } from 'react';
import { Spin, Modal } from 'antd';
import { useRequest, request } from 'umi';
import moment from 'moment';
import { Area } from '@ant-design/plots';
import API from '@/api'

export default function HistoryModal(props) {
  const { visible, onClose, item } = props

  useEffect(() => {
    visible && run()
  }, [visible])

  const {
    loading,
    run,
    data = {},
  } = useRequest(() => request(API('/history'), {
    method: 'GET',
    params: { id: item._id },
  }), {
    manual: true,
  })

  const { list = [] } = data
  const processData = list.reduce((acc, curr) => [
    ...acc,
    { type: '一环 (65%)', date: moment(curr.date).format('YYYY-MM-DD'), value: curr.mastery_65 },
    { type: '二环 (85%)', date: moment(curr.date).format('YYYY-MM-DD'), value: curr.mastery_85 },
    { type: '三环 (95%)', date: moment(curr.date).format('YYYY-MM-DD'), value: curr.mastery_95 },
  ], [])

  const config = {
    data: processData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    color: ['#47d747', '#66aaff', '#cc44ff'],
    slider: {
      start: 0,
      end: 1,
    },
  }

  return (
    <Modal
      title={`${item.name} 历史数据`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={860}
    >
      <Spin spinning={loading}>
        <Area {...config} />
      </Spin>
    </Modal>
  )
};
