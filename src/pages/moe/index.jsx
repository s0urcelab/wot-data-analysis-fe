import { Suspense, useState, useEffect } from 'react';
import moment from 'moment';
import Icon, {
    CheckOutlined,
    CloseOutlined,
    UndoOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
} from '@ant-design/icons';
import {
    Modal,
    Switch,
    Statistic,
    Tooltip,
    Image,
    Space,
    Button,
    Col,
    Card,
    Radio,
    Row,
    message,
} from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { useRequest } from 'umi';
import API from '@/api';
import PageLoading from './components/PageLoading';
import HistoryModal from './components/HistoryModal';
import NetSearch from './components/NetSearch';
import TANK_TYPE from './type_svg';
import './index.less';

const getFlag = (nation) =>
    `//static-cdn.wotgame.cn/static/5.100.1_cae685/wotp_static/img/core/frontend/scss/common/components/icons/img/filter-${nation}.png`;
// const getIcon = name => `//static-cdn.wotgame.cn/dcont/tankopedia_images/${name.toLowerCase()}/${name.toLowerCase()}_icon.svg`
const getIcon = (name) =>
    `//static-cdn.wotgame.cn/dcont/tankopedia_images/${name.toLowerCase()}/${name.toLowerCase()}_icon.svg`;
const DEFAULT_ICON =
    '//static-cdn.wotgame.cn/static/5.100.1_cae685/wotp_static/img/tankopedia_new/frontend/scss/tankopedia-detail/img/tanks/default_heavy_icon.svg';
const NATION_CN = {
    china: '中国',
    czech: '捷克',
    france: '法国',
    germany: '德国',
    italy: '意大利',
    japan: '日本',
    poland: '波兰',
    sweden: '瑞典',
    uk: '英国',
    usa: '美国',
    ussr: '苏联',
};
const GET_MASTERY_BADGE = (lv) => {
    switch (lv) {
        case 4:
            return `//static-cdn.wotgame.cn/dcont/fb/image/ace_tanker_3ejeyie.png`;
        case 3:
            return `//static-cdn.wotgame.cn/dcont/fb/image/mastery_badge_class_i_kecwa6q.png`;
        case 2:
            return `//static-cdn.wotgame.cn/dcont/fb/image/mastery_badge_class_ii_6ezpfo3.png`;
        case 1:
            return `//static-cdn.wotgame.cn/dcont/fb/image/mastery_badge_class_iii_mawszi8.png`;
        default:
            return '';
    }
};

const GET_MOE_BADGE = (nation, lv) =>
    lv < 1
        ? ''
        : `//worldoftanks.asia/dcont/wot/current/marksOnGun/67x71/${nation}_${lv}_mark${
              lv > 1 ? 's' : ''
          }.png`;

function Analysis() {
    const [playerName, setName] = useState('');
    const [searchParams, setSearch] = useState({});
    // const [page, setPage] = useState(1)
    // const [size, setSize] = useState(20)
    const [isModalVisible, setVisible] = useState(false);
    const [selectedRecord, setRecord] = useState({
        _id: -1,
        name: '-',
        tech_name: '',
        tank_icon: '',
    });

    const openModal = (record) => {
        setVisible(true);
        setRecord(record);
    };

    const updateSearch = (key, val) => {
        setSearch((p) => ({ ...p, [key]: val }));
    };

    const fetchTanks = async (params, sort) => {
        const isSort = !!Object.keys(sort).length;

        const { errCode, data } = await API('/tankList', {
            method: 'GET',
            params: {
                page: params.current,
                size: params.pageSize,
                ...(params.player_id && { player_id: params.player_id }),
                ...(params.nation && { nation: params.nation }),
                ...(params.type && { type: params.type }),
                ...(params.tier && { tier: params.tier }),
                ...(params.premium && { premium: params.premium }),
                ...(params.collector_vehicle && { collector_vehicle: params.collector_vehicle }),
                ...(isSort && { sort: Object.keys(sort)[0] }),
                ...(isSort && { order: Object.values(sort)[0] }),
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
    };

    const {
        run: fetchPre,
        loading,
        data = {
            nations: [],
            tiers: [],
            types: [],
            player: {},
        },
    } = useRequest(() =>
        API('/preData', {
            method: 'GET',
            params: {
                ...(window.localStorage['bind_player_id'] && {
                    pid: window.localStorage['bind_player_id'],
                }),
                ...(window.localStorage['bind_player_nickname'] && {
                    pn: window.localStorage['bind_player_nickname'],
                }),
            },
        }),
    );

    async function bindPlayer(name) {
        if (!name.trim()) return [];

        const { errCode, msg, data } = await API('/bindUser', {
            method: 'POST',
            data: { nickname: name.trim() },
        });

        if (errCode !== 0) {
            message.error(msg);
            return [];
        }

        return data.map((v) => ({
            id: v.account_id,
            name: v.account_name,
            clan: v.clan_tag,
        }));
    }

    const unbindPlayer = () => {
        setName('');
        updateSearch('player_id', '');
        window.localStorage.removeItem('bind_player_id');
        window.localStorage.removeItem('bind_player_nickname');
        message.success('解绑成功！');
    };

    const onSwChange = (isON) => {
        updateSearch('player_id', isON ? window.localStorage['bind_player_id'] : '');
    };

    const onPlayerNameSelected = ({ value, title }) => {
        setName(title);
        updateSearch('player_id', value);
        window.localStorage['bind_player_id'] = value;
        window.localStorage['bind_player_nickname'] = title;
        fetchPre();
        message.success('绑定成功！');
    };

    const showBindInfo = () => {
        Modal.info({
            title: '"绑定玩家" 功能已更新',
            content: '如果你之前绑定过现在报错，请解绑后重新绑定！',
            onOk: () => {
                window.localStorage['INFO_BINDING_IS_READ'] = 1
                return;
            },
        });
    };

    useEffect(() => {
        if (window.localStorage['bind_player_id']) {
            updateSearch('player_id', window.localStorage['bind_player_id']);
        }
        if (window.localStorage['bind_player_nickname']) {
            setName(window.localStorage['bind_player_nickname']);
        }
        if (!window.localStorage['INFO_BINDING_IS_READ']) {
            showBindInfo()
        }
    }, []);

    const columns = [
        {
            title: '排名',
            dataIndex: 'rank',
            width: '6%',
            render: (rank, { rank_delta }) => {
                const RankIcon = rank_delta > 0 ? ArrowUpOutlined : ArrowDownOutlined;
                const delta = Math.abs(rank_delta);
                return (
                    <>
                        <span className="tank-rank">{rank}</span>
                        {!!rank_delta && (
                            <span className={`rank-delta ${rank_delta > 0 ? 'up' : 'down'}`}>
                                <RankIcon style={{ fill: 'currentColor' }} />
                                {delta}
                            </span>
                        )}
                    </>
                );
            },
        },
        {
            title: '国别',
            dataIndex: 'nation',
            width: '5%',
            render: (nation) => (
                <img
                    className="tank-nation"
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
            render: (type, { premium }) => (
                <Icon component={TANK_TYPE[type]} style={{ color: premium ? '#fab81b' : '#999' }} />
            ),
        },
        {
            title: '等级',
            dataIndex: 'tier',
            width: '5%',
            render: (tier, { premium }) => (
                <span className={`tank-tier ${premium ? 'premium' : ''}`}>
                    {String.fromCodePoint(tier + 8543)}
                </span>
            ),
            className: 'font-consolas',
        },
        {
            title: '坦克名称',
            dataIndex: 'name',
            width: '30%',
            render: (name, record) => {
                const { tech_name = '', premium, nation, pl } = record;
                return (
                    <div
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                        onClick={() => openModal(record)}
                    >
                        <Tooltip title="点击查看历史数据">
                            <Image
                                width={60}
                                src={getIcon(tech_name || '')}
                                fallback={DEFAULT_ICON}
                                preview={false}
                            />
                            <span className={`tank-name ${premium ? 'premium' : ''}`}>{name}</span>
                        </Tooltip>
                        {pl && (
                            <Space>
                                <Image
                                    width={44}
                                    src={GET_MASTERY_BADGE(pl.mastery)}
                                    preview={false}
                                />
                                <Image
                                    width={44}
                                    src={GET_MOE_BADGE(nation, pl.moe)}
                                    preview={false}
                                />
                            </Space>
                        )}
                    </div>
                );
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

    const effIndicator = (delta) => (
        <span style={{ color: delta >= 0 ? '#3f8600' : '#cf1322' }}>
            {delta >= 0 ? `(↑${Math.abs(delta)})` : `(↓${Math.abs(delta)})`}
        </span>
    );
    const effColor = (eff) => {
        if (eff <= 600) return '#F10000';
        if (eff <= 800) return '#00C100';
        if (eff <= 1000) return '#66AAFF';
        if (eff <= 1200) return '#CC44FF';
        if (eff <= 1400) return '#FFD700';
        return '#FFAA33';
    };
    const winColor = (win) => {
        if (win <= 45.49) return '#F10000';
        if (win <= 49.49) return '#00C100';
        if (win <= 52.49) return '#66AAFF';
        if (win <= 55.49) return '#CC44FF';
        if (win <= 59.49) return '#FFD700';
        return '#FFAA33';
    };

    return (
        <GridContent>
            <Suspense fallback={<PageLoading />}>
                <Row
                    style={{ marginBottom: 24 }}
                    gutter={24}
                    justify="space-between"
                    align="middle"
                >
                    <Col>
                        <Card
                            bordered={false}
                            loading={loading}
                            title={
                                <div className="player-header">
                                    <span className="player-name">{playerName || '绑定玩家'}</span>
                                    {!!playerName && (
                                        <Button type="primary" danger onClick={unbindPlayer}>
                                            解绑
                                        </Button>
                                    )}
                                </div>
                            }
                        >
                            {!playerName && (
                                <NetSearch
                                    placeholder="查找玩家昵称..."
                                    size="large"
                                    fetchOptions={bindPlayer}
                                    onChange={onPlayerNameSelected}
                                    style={{
                                        width: '400px',
                                    }}
                                />
                            )}
                            {!!playerName && data.player && (
                                <>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Statistic
                                                title="场次"
                                                value={data.player.battTotal}
                                                formatter={(n) => `${(n / 1000).toFixed(2)}K`}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic
                                                title="胜率"
                                                value={data.player.winRate}
                                                precision={2}
                                                suffix="%"
                                                valueStyle={{
                                                    color: winColor(data.player.winRate),
                                                }}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic title="个人等级" value={data.player.wgr} />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic
                                                title="盒子效率"
                                                value={data.player.eff}
                                                formatter={(n) => (
                                                    <>
                                                        {n} {effIndicator(data.player.effDelta)}
                                                    </>
                                                )}
                                                valueStyle={{ color: effColor(data.player.eff) }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 24 }}>
                                        <Space>
                                            <Switch
                                                checkedChildren={<CheckOutlined />}
                                                unCheckedChildren={<CloseOutlined />}
                                                defaultChecked
                                                onChange={onSwChange}
                                            />
                                            <span style={{ color: '#999' }}>
                                                隐藏玩家没有的车辆
                                            </span>
                                        </Space>
                                    </Row>
                                </>
                            )}
                        </Card>
                    </Col>
                    <Col>
                        <img src={require('./kv5.webp')} alt="" style={{ maxHeight: '180px' }} />
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
                                    onChange={(e) => updateSearch('nation', e.target.value)}
                                >
                                    <Radio.Button value="">ALL</Radio.Button>
                                    {data.nations.map((item) => (
                                        <Radio.Button key={item} value={item}>
                                            <img
                                                src={getFlag(item)}
                                                title={NATION_CN[item]}
                                                height={18}
                                            />
                                        </Radio.Button>
                                    ))}
                                </Radio.Group>
                            </Row>

                            <Row>
                                <Space>
                                    {/* 类型 */}
                                    <Radio.Group
                                        value={searchParams.type || ''}
                                        buttonStyle="solid"
                                        onChange={(e) => updateSearch('type', e.target.value)}
                                    >
                                        <Radio.Button value="">ALL</Radio.Button>
                                        {data.types.map((item) => (
                                            <Radio.Button key={item} value={item}>
                                                <Icon
                                                    component={TANK_TYPE[item]}
                                                    style={{ verticalAlign: 'middle' }}
                                                />
                                            </Radio.Button>
                                        ))}
                                    </Radio.Group>

                                    {/* 等级 */}
                                    <Radio.Group
                                        value={searchParams.tier || ''}
                                        buttonStyle="solid"
                                        onChange={(e) => updateSearch('tier', e.target.value)}
                                    >
                                        <Radio.Button value="">ALL</Radio.Button>
                                        {data.tiers.map((item) => (
                                            <Radio.Button key={item} value={item}>
                                                {String.fromCodePoint(item + 8543)}
                                            </Radio.Button>
                                        ))}
                                    </Radio.Group>
                                </Space>
                            </Row>

                            <Row>
                                <Space>
                                    <Radio.Group
                                        value={searchParams.premium || ''}
                                        buttonStyle="solid"
                                        onChange={(e) => updateSearch('premium', e.target.value)}
                                    >
                                        <Radio.Button value="">ALL</Radio.Button>
                                        <Radio.Button value="1">金币/特种</Radio.Button>
                                        <Radio.Button value="0">普通</Radio.Button>
                                    </Radio.Group>

                                    <Radio.Group
                                        value={searchParams.collector_vehicle || ''}
                                        buttonStyle="solid"
                                        onChange={(e) =>
                                            updateSearch('collector_vehicle', e.target.value)
                                        }
                                    >
                                        <Radio.Button value="">ALL</Radio.Button>
                                        <Radio.Button value="1">收藏</Radio.Button>
                                        <Radio.Button value="0">普通</Radio.Button>
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
                            <Row>
                                <span style={{ fontWeight: 'bold' }}>
                                    最后更新日期：
                                    {moment(data.lastUpdate).format('YYYY-MM-DD HH:mm:ss')}
                                </span>
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
}

export default Analysis;
