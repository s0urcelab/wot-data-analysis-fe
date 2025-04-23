import { Suspense, useState } from 'react';
import { Alert, Button, Space, Divider, Badge, Row, Col, Typography, Image } from 'antd';
import { CloudDownloadOutlined, ToolOutlined } from '@ant-design/icons';
import useLatestVersion from '@/hooks/useLatestVersion';
import ToolModal from './components/ToolModal';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const DL_HOST = '//dl.src.moe:8000';

function BoxCE() {
    const [isModalVisible, setVisible] = useState(false);
    const latestVersion = useLatestVersion();
    const MODS_DL = `${DL_HOST}/wot/${latestVersion}/s0urce.box.combat.eff.wotmod`;
    const MODS_ATLAS_DL = `${DL_HOST}/wot/${latestVersion}/s0urce.box.combat.eff.atlas.wotmod`;

    const warning = (
        <div>
            战力颜色显示需要修改资源文件，如果你没有使用任何坦克图标插件，请直接下载
            <a href={MODS_ATLAS_DL} target="_blank" rel="noreferrer">
                预处理图标
            </a>
            配合使用。如果你使用了某款图标插件，你需要使用本站提供的
            <a onClick={() => setVisible(true)}>处理工具</a>。
        </div>
    );
    return (
        <>
            <Row justify="center" style={{ margin: '40px 0' }}>
                <Title level={1}>🕹 盒子战斗力纯净版</Title>
            </Row>
            <Row justify="center">
                <Title level={4}>
                    当前版本：<Text code>{latestVersion}</Text>
                </Title>
            </Row>
            <Row justify="center">
                <Paragraph className="boxce-p">
                    <ul>
                        <li>
                            无需安装盒子，放入<Text code>mods</Text>目录即可使用
                        </li>
                        <li>仿XVM配色，一目了然，区分不同段位玩家</li>
                        <li>玩家面板 & 玩家头顶 显示千场战斗力、胜率</li>
                        <li>暂不受战力伪装卡影响，可查看所有玩家战力</li>
                    </ul>
                </Paragraph>
            </Row>
            <Row justify="center" style={{ marginBottom: '30px' }}>
                <Alert type="warning" showIcon message={warning} />
            </Row>
            <Row justify="center">
                <Space size={20}>
                    <Button
                        type="primary"
                        icon={<CloudDownloadOutlined />}
                        size="large"
                        onClick={() => window.open(MODS_DL)}
                    >
                        下载插件
                    </Button>
                    <Button
                        type="primary"
                        icon={<CloudDownloadOutlined />}
                        size="large"
                        onClick={() => window.open(MODS_ATLAS_DL)}
                    >
                        下载预处理图标
                    </Button>
                    <Button
                        // type="primary"
                        icon={<ToolOutlined />}
                        size="large"
                        onClick={() => setVisible(true)}
                    >
                        处理工具
                    </Button>
                    <Alert message="插件QQ群：927946470" type="success" />
                </Space>
            </Row>
            <Divider />
            <Row justify="center" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="middle">
                <Col>
                    <Image width={260} src={require('./screenshot_1.webp')} />
                </Col>
                <Col>
                    <Image width={300} src={require('./screenshot_2.webp')} />
                </Col>
                <Col>
                    <Image width={120} src={require('./screenshot_3.webp')} />
                </Col>
            </Row>

            <Row justify="center" align="middle">
                <Divider>战斗力颜色说明</Divider>
                <Space direction="vertical">
                    <Badge color="rgb(241, 0, 0)" text="0 ~ 600" />
                    <Badge color="rgb(0, 193, 0)" text="600 ~ 800" />
                    <Badge color="rgb(102, 170, 255)" text="800 ~ 1000" />
                    <Badge color="rgb(204, 68, 255)" text="1000 ~ 1200" />
                    <Badge color="rgb(255, 215, 0)" text="> 1200" />
                </Space>
            </Row>

            <ToolModal
                key={isModalVisible}
                visible={isModalVisible}
                onClose={() => setVisible(false)}
            />
        </>
    );
}

export default BoxCE;
