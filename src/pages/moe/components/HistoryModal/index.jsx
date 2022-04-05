import { useEffect } from 'react';
import { Spin, Modal } from 'antd';
import { useRequest, request } from 'umi';
import moment from 'moment';
import { Area } from '@ant-design/plots';
import API from '@/api'
import './index.less'

const getBg = name => `//static-cdn.wotgame.cn/dcont/tankopedia_images/${name.toLowerCase()}/${name.toLowerCase()}_image.png`

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
    { type: '三环 (95%)', date: moment(curr.date).format('YYYY-MM-DD'), value: curr.mastery_95, delta: curr.mastery_95 - curr.mastery_85 },
    { type: '二环 (85%)', date: moment(curr.date).format('YYYY-MM-DD'), value: curr.mastery_85, delta: curr.mastery_85 - curr.mastery_65 },
    { type: '一环 (65%)', date: moment(curr.date).format('YYYY-MM-DD'), value: curr.mastery_65, delta: curr.mastery_65 },
  ], [])

  const config = {
    data: processData,
    xField: 'date',
    yField: 'delta',
    seriesField: 'type',
    tooltip: {
      fields: ['type', 'value'],
      formatter: (datum) => ({ name: datum.type, value: datum.value }),
    },
    color: ['#cc44ff', '#66aaff', '#47d747'],
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
        <div className="bg-wrapper">
          <div className="bg-img" style={{ backgroundImage: `url(${getBg(item.tech_name)})` }}/>
          <Area {...config} />
        </div>
      </Spin>
    </Modal>
  )
};
