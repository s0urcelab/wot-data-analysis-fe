import { Alert, Button, Space, Divider, Row, Col, Typography, Image } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import './index.less';

const { Title, Text } = Typography;

const ATLAS_DL = '//home.src.moe:8000/download/Athena%E5%9B%BE%E6%A0%87%E9%87%8D%E5%88%B6%E7%89%88/athena.icon.remake.big.wotmod'
const ATLAS_MIRROR_DL = '//home.src.moe:8000/download/Athena%E5%9B%BE%E6%A0%87%E9%87%8D%E5%88%B6%E7%89%88/AntiMirror_battle.wotmod'
const ATLAS_WITH_BOX_CE_DL = '//home.src.moe:8000/download/Athena%E5%9B%BE%E6%A0%87%E9%87%8D%E5%88%B6%E7%89%88/athena.icon.with.box-ce.wotmod'

function AthenaAtlas() {
  return (
    <>
      <Row justify="center" style={{ margin: '40px 0' }}>
        <Title level={1}>🌈 Athena图标重制版</Title>
      </Row>
      <Row justify="center">
        <Title level={4}>当前版本：<Text code>1.17.1.3</Text></Title>
      </Row>
      <Row justify="center" style={{ marginBottom: '14px' }}>
        <Alert
          type="warning"
          showIcon
          message="xvm用户不需要下载反向插件"
        />
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
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            onClick={() => window.open(ATLAS_MIRROR_DL)}
          >
            下载图标反向插件
          </Button>
          <Button
            // type="primary"
            icon={<DownloadOutlined />}
            size="large"
            onClick={() => window.open(ATLAS_WITH_BOX_CE_DL)}
          >
            下载图标（适配本站盒子战斗力纯净版）
          </Button>
        </Space>
      </Row>
      <Divider />
      <Row
        justify="center"
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        align="middle"
      >
        <Col>
          <Image
            width={260}
            src="/atlas.webp"
          />
        </Col>
      </Row>
    </>
  )
}

export default AthenaAtlas;
