import { Suspense, useState } from 'react';
import moment from 'moment';
import Icon from '@ant-design/icons';
import { Col, Card, Radio, Row } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { Progress } from '@ant-design/charts';
import ProTable from '@ant-design/pro-table';
import { request, useRequest } from 'umi';
import PageLoading from './components/PageLoading';
import { ChartCard, Field } from './components/Charts';
import TANK_TYPE from './type_svg'
import './style.less';

const getFlag = nation => `//static-cdn.wotgame.cn/static/5.100.1_cae685/wotp_static/img/core/frontend/scss/common/components/icons/img/filter-${nation}.png`
const getIcon = name => `//static-cdn.wotgame.cn/dcont/tankopedia_images/${name.toLowerCase()}/${name.toLowerCase()}_icon.svg`

function Analysis() {
  const [searchParams, setSearch] = useState({})

  const updateSearch = (key, val) => {
    setSearch(p => ({ ...p, [key]: val }))
  }

  const fetchTanks = async (params, sort) => {
    const isSort = !!Object.keys(sort).length

    const { errCode, data } = await request('//home.src.moe:8000/wot/tankList', {
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
  } = useRequest('//home.src.moe:8000/wot/preData');

  const columns = [
    {
      title: '国别',
      dataIndex: 'nation',
      render: nation => <img className='tank-nation' src={getFlag(nation)} alt="" />,
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (type, { premium }) => <Icon component={TANK_TYPE[type]} style={{ color: premium ? '#fab81b' : '#999' }} />,
    },
    {
      title: '等级',
      dataIndex: 'tier',
      render: (tier, { premium }) => <span className={`tank-tier ${premium ? 'premium' : ''}`}>{String.fromCodePoint(tier + 8543)}</span>,
      className: 'font-consolas',
    },
    {
      title: '坦克名称',
      dataIndex: 'name',
      render: (name, { tech_name, premium }) => (
        <div style={{ cursor: "pointer" }}>
          <img className='tank-icon' src={getIcon(tech_name)} alt="" />
          <span className={`tank-name ${premium ? 'premium' : ''}`}>{name}</span>
        </div>
      ),
    },
    {
      title: '一环（65%）',
      dataIndex: 'mastery_65',
      sorter: true,
      className: 'font-consolas',
    },
    {
      title: '二环（85%）',
      dataIndex: 'mastery_85',
      sorter: true,
      className: 'font-consolas',
    },
    {
      title: '三环（95%）',
      dataIndex: 'mastery_95',
      sorter: true,
      className: 'font-consolas',
    },
  ];

  return (
    <GridContent>
      <Suspense fallback={<PageLoading />}>
        <Row gutter={24}>
          <Col style={{ marginBottom: 24 }}>
            <ChartCard
              bordered={false}
              loading={loading}
              title="击杀环 / 全部坦克"
              total={`${data.hasMastery} / ${data.total}`}
              footer={(
                <Field label="最后更新日期" value={moment(data.lastUpdate).format('YYYY-MM-DD HH:mm:ss')} />
              )}
              contentHeight={46}
            >
              <Progress
                height={46}
                percent={data.hasMastery / data.total}
                forceFit
                size={8}
                color='#ff7e00'
              />
            </ChartCard>
          </Col>
        </Row>
      </Suspense>

      <ProTable
        tableExtraRender={() => (
          <Card>
            <Row style={{ marginBottom: '10px' }}>
              {/* 国别 */}
              <Radio.Group
                defaultValue=""
                buttonStyle="solid"
                onChange={e => updateSearch('nation', e.target.value)}
              >
                <Radio.Button value="" >ALL</Radio.Button>
                {
                  data.nations.map(item => (
                    <Radio.Button key={item} value={item}>
                      <img src={getFlag(item)} alt="" height={18} />
                    </Radio.Button>
                  ))
                }
              </Radio.Group>
            </Row>

            <Row style={{ marginBottom: '10px' }}>
              {/* 类型 */}
              <Radio.Group
                defaultValue=""
                buttonStyle="solid"
                onChange={e => updateSearch('type', e.target.value)}
                style={{ marginRight: '20px' }}
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
                defaultValue=""
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
            </Row>

            <Row>
              <Radio.Group
                defaultValue=""
                buttonStyle="solid"
                onChange={e => updateSearch('premium', e.target.value)}
                style={{ marginRight: '20px' }}
              >
                <Radio.Button value="" >ALL</Radio.Button>
                <Radio.Button value="1" >金币/特种</Radio.Button>
                <Radio.Button value="0" >普通</Radio.Button>
              </Radio.Group>

              <Radio.Group
                defaultValue=""
                buttonStyle="solid"
                onChange={e => updateSearch('collector_vehicle', e.target.value)}
              >
                <Radio.Button value="" >ALL</Radio.Button>
                <Radio.Button value="1" >收藏</Radio.Button>
                <Radio.Button value="0" >普通</Radio.Button>
              </Radio.Group>
            </Row>
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
          pageSizeOptions: [10, 20, 40],
        }}
      />
    </GridContent>
  );
};

export default Analysis;
