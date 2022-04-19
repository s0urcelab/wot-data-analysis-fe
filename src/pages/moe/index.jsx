import { Suspense, useState } from 'react';
import moment from 'moment';
import Icon, { UndoOutlined, ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Tooltip, Image, Space, Button, Col, Card, Radio, Row } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { Progress } from '@ant-design/plots';
import ProTable from '@ant-design/pro-table';
import { useRequest } from 'umi';
import API from '@/api'
import PageLoading from './components/PageLoading';
import { ChartCard, Field } from './components/Charts';
import HistoryModal from './components/HistoryModal';
import TANK_TYPE from './type_svg'
import './index.less';

const getFlag = nation => `//static-cdn.wotgame.cn/static/5.100.1_cae685/wotp_static/img/core/frontend/scss/common/components/icons/img/filter-${nation}.png`
// const getIcon = name => `//static-cdn.wotgame.cn/dcont/tankopedia_images/${name.toLowerCase()}/${name.toLowerCase()}_icon.svg`
const getIcon = name => `//sg-wotp.wgcdn.co/dcont/tankopedia_images/${name.toLowerCase()}/${name.toLowerCase()}_icon.svg`

const DEFAULT_ICON = '//static-cdn.wotgame.cn/static/5.100.1_cae685/wotp_static/img/tankopedia_new/frontend/scss/tankopedia-detail/img/tanks/default_heavy_icon.svg'
const NATION_CN = {
  'china': '中国',
  'czech': '捷克',
  'france': '法国',
  'germany': '德国',
  'italy': '意大利',
  'japan': '日本',
  'poland': '波兰',
  'sweden': '瑞典',
  'uk': '英国',
  'usa': '美国',
  'ussr': '苏联',
}

function Analysis() {
  const [searchParams, setSearch] = useState({})
  // const [page, setPage] = useState(1)
  // const [size, setSize] = useState(20)
  const [isModalVisible, setVisible] = useState(false)
  const [selectedRecord, setRecord] = useState({
    _id: -1,
    name: '-',
    tech_name: '',
    tank_icon: '',
  })

  const openModal = (record) => {
    setVisible(true)
    setRecord(record)
  }

  const updateSearch = (key, val) => {
    setSearch(p => ({ ...p, [key]: val }))
  }

  const fetchTanks = async (params, sort) => {
    const isSort = !!Object.keys(sort).length

    const { errCode, data } = await API('/tankList', {
      method: 'GET',
      params: {
        page: params.current,
        size: params.pageSize,
        ...params.nation && { nation: params.nation },
        ...params.type && { type: params.type },
        ...params.tier && { tier: params.tier },
        ...params.premium && { premium: params.premium },
        ...params.collector_vehicle && { collector_vehicle: params.collector_vehicle },
        ...isSort && { sort: Object.keys(sort)[0] },
        ...isSort && { order: Object.values(sort)[0] },
      },
    });

    return {
      data: data.list,
      // success 请返回 true，
      // 不然 table 会停止解析数据，即使有数据
      success: errCode === 0,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: data.total,
    };
  }

  const {
    loading,
    data = {
      hasMastery: 0,
      total: 0,
      nations: [],
      tiers: [],
      types: [],
    },
  } = useRequest(() => API('/preData', {
    method: 'GET',
  }));

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: '6%',
      render: (rank, { rank_delta }) => {
        const RankIcon = rank_delta > 0 ? ArrowUpOutlined : ArrowDownOutlined
        const delta = Math.abs(rank_delta)
        return (
          <>
            <span className='tank-rank'>{rank}</span>
            {
              !!rank_delta && (
                <span className={`rank-delta ${rank_delta > 0 ? 'up' : 'down'}`}>
                  <RankIcon style={{ fill: 'currentColor' }} />
                  {delta}
                </span>
              )
            }
          </>
        )
      },
    },
    {
      title: '国别',
      dataIndex: 'nation',
      width: '5%',
      render: nation => (
        <img
          className='tank-nation'
          src={getFlag(nation)}
          title={NATION_CN[nation]}
          alt=""
        />
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: '5%',
      render: (type, { premium }) => <Icon component={TANK_TYPE[type]} style={{ color: premium ? '#fab81b' : '#999' }} />,
    },
    {
      title: '等级',
      dataIndex: 'tier',
      width: '5%',
      render: (tier, { premium }) => (
        <span className={`tank-tier ${premium ? 'premium' : ''}`}>{String.fromCodePoint(tier + 8543)}</span>
      ),
      className: 'font-consolas',
    },
    {
      title: '坦克名称',
      dataIndex: 'name',
      width: '30%',
      render: (name, record) => {
        const { tech_name, premium } = record
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => openModal(record)}
          >
            <Tooltip title="点击查看历史数据">
              <Image
                width={60}
                src={getIcon(tech_name)}
                fallback={DEFAULT_ICON}
                preview={false}
              />
              <span className={`tank-name ${premium ? 'premium' : ''}`}>{name}</span>
            </Tooltip>
          </div>
        )
      },
    },
    {
      title: '一环 (65%)',
      dataIndex: 'mastery_65',
      sorter: true,
      className: 'font-consolas',
    },
    {
      title: '二环 (85%)',
      dataIndex: 'mastery_85',
      sorter: true,
      className: 'font-consolas',
    },
    {
      title: '三环 (95%)',
      dataIndex: 'mastery_95',
      sorter: true,
      className: 'font-consolas',
      defaultSortOrder: 'descend',
    },
  ];

  return (
    <GridContent>
      <Suspense fallback={<PageLoading />}>
        <Row gutter={24} justify="space-between" >
          <Col style={{ marginBottom: 24 }}>
            <ChartCard
              bordered={false}
              loading={loading}
              title={<span style={{ fontWeight: 'bold' }}>已收录 / 击杀环坦克</span>}
              total={`${data.hasMastery} / ${data.total}`}
              footer={(
                <Field label="最后更新日期" value={moment(data.lastUpdate).format('YYYY-MM-DD HH:mm:ss')} />
              )}
              contentHeight={46}
            >
              <Progress
                height={24}
                percent={data.hasMastery / data.total}
                forceFit
                size={8}
                color='#ff7e00'
              />
            </ChartCard>
          </Col>
          <Col>
            <img src="/kv5.webp" alt="" style={{ maxHeight: '180px' }} />
          </Col>
        </Row>
      </Suspense>

      <ProTable
        style={{ minWidth: '800px' }}
        tableExtraRender={() => (
          <Card>
            <Space direction="vertical">
              <Row>
                {/* 国别 */}
                <Radio.Group
                  value={searchParams.nation || ''}
                  buttonStyle="solid"
                  onChange={e => updateSearch('nation', e.target.value)}
                >
                  <Radio.Button value="" >ALL</Radio.Button>
                  {
                    data.nations.map(item => (
                      <Radio.Button
                        key={item}
                        value={item}
                      >
                        <img
                          src={getFlag(item)}
                          title={NATION_CN[item]}
                          height={18}
                        />
                      </Radio.Button>
                    ))
                  }
                </Radio.Group>
              </Row>

              <Row>
                <Space>
                  {/* 类型 */}
                  <Radio.Group
                    value={searchParams.type || ''}
                    buttonStyle="solid"
                    onChange={e => updateSearch('type', e.target.value)}
                  >
                    <Radio.Button value="" >ALL</Radio.Button>
                    {
                      data.types.map(item => (
                        <Radio.Button key={item} value={item}>
                          <Icon component={TANK_TYPE[item]} style={{ verticalAlign: 'middle' }} />
                        </Radio.Button>
                      ))
                    }
                  </Radio.Group>

                  {/* 等级 */}
                  <Radio.Group
                    value={searchParams.tier || ''}
                    buttonStyle="solid"
                    onChange={e => updateSearch('tier', e.target.value)}
                  >
                    <Radio.Button value="" >ALL</Radio.Button>
                    {
                      data.tiers.map(item => (
                        <Radio.Button key={item} value={item}>
                          {String.fromCodePoint(item + 8543)}
                        </Radio.Button>
                      ))
                    }
                  </Radio.Group>
                </Space>
              </Row>

              <Row>
                <Space>
                  <Radio.Group
                    value={searchParams.premium || ''}
                    buttonStyle="solid"
                    onChange={e => updateSearch('premium', e.target.value)}
                  >
                    <Radio.Button value="" >ALL</Radio.Button>
                    <Radio.Button value="1" >金币/特种</Radio.Button>
                    <Radio.Button value="0" >普通</Radio.Button>
                  </Radio.Group>

                  <Radio.Group
                    value={searchParams.collector_vehicle || ''}
                    buttonStyle="solid"
                    onChange={e => updateSearch('collector_vehicle', e.target.value)}
                  >
                    <Radio.Button value="" >ALL</Radio.Button>
                    <Radio.Button value="1" >收藏</Radio.Button>
                    <Radio.Button value="0" >普通</Radio.Button>
                  </Radio.Group>

                  <Button
                    type="primary"
                    shape="round"
                    icon={<UndoOutlined />}
                    onClick={() => setSearch({})}
                  >
                    重置筛选
                  </Button>
                </Space>
              </Row>
            </Space>
          </Card>
        )}
        tableStyle={{ margin: '0 16px' }}
        rowKey="_id"
        toolBarRender={false}
        search={false}
        params={searchParams}
        request={fetchTanks}
        columns={columns}
        pagination={{
          defaultPageSize: 20,
          pageSizeOptions: [20, 40, 100],
        }}
        sticky
      />

      <HistoryModal
        item={selectedRecord}
        visible={isModalVisible}
        onClose={() => setVisible(false)}
      />
    </GridContent>
  );
};

export default Analysis;
