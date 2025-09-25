import { Alert, Button, Space, Divider, Row, Col, Typography, Image } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import useLatestVersion from '@/hooks/useLatestVersion';
import './index.less';

const { Title, Text } = Typography;

const DL_HOST = '//dl.src.moe:8000';

function AthenaAtlas() {
    const latestVersion = useLatestVersion();
    const ATLAS_DL = `${DL_HOST}/wot/${latestVersion}/athena.icon.remake.big.wotmod`;
    const ATLAS_MIRROR_DL = `${DL_HOST}/wot/${latestVersion}/AntiMirror_battle.wotmod`;

    return (
        <>
            <Row justify="center" style={{ margin: '40px 0' }}>
                <Title level={1}>🌈 Athena图标重制版</Title>
            </Row>
            <Row justify="center">
                <Title level={4}>
                    当前版本：<Text code>{latestVersion}</Text>
                </Title>
            </Row>
            <Row justify="center" style={{ marginBottom: '14px' }}>
                <Alert type="warning" showIcon message="xvm用户不需要下载反向插件" />
            </Row>
            <Row justify="center">
                <Space size={20}>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        size="large"
                        onClick={() => window.open(ATLAS_DL)}
                    >
                        下载图标
                    </Button>
                    <Button
                        icon={<DownloadOutlined />}
                        size="large"
                        onClick={() => window.open(ATLAS_MIRROR_DL)}
                    >
                        下载图标反向插件
                    </Button>
                    <Alert message="插件QQ群：927946470" type="success" />
                </Space>
            </Row>
            <Divider />
            <Row justify="center" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="middle">
                <Col>
                    <Image width={260} src={require('./atlas.webp')} />
                </Col>
            </Row>
        </>
    );
}

export default AthenaAtlas;
