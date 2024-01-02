import { Typography, Divider } from 'antd';
import './index.less';

const { Title, Paragraph } = Typography;

function Changelogs() {
  return (
    <Typography>
      <Title>🔥 更新日志 Changelogs</Title>
      <Divider />

      <Title strong level={3}>
        2022-04-05
      </Title>
      <Paragraph className="changelog-p">
        <ul>
          <li>🎉 击杀环标伤查询上线</li>
        </ul>
      </Paragraph>
      <Divider />

      <Title strong level={3}>
        2022-04-12
      </Title>
      <Paragraph className="changelog-p">
        <ul>
          <li>🎉 新增排名变动情况</li>
          <li>⚙ 调整收录坦克列表</li>
          <li>⚙ 调整分页最大记录为100条</li>
        </ul>
      </Paragraph>
      <Divider />

      <Title strong level={3}>
        2022-04-15
      </Title>
      <Paragraph className="changelog-p">
        <ul>
          <li>🎉 盒子战斗力纯净版 插件上线</li>
        </ul>
      </Paragraph>
      <Divider />

      <Title strong level={3}>
        2022-04-18
      </Title>
      <Paragraph className="changelog-p">
        <ul>
          <li>🎉 Athena图标重制版 上线</li>
        </ul>
      </Paragraph>
      <Divider />

      <Title strong level={3}>
        2022-04-20
      </Title>
      <Paragraph className="changelog-p">
        <ul>
          <li>🎉 新增留言板</li>
        </ul>
      </Paragraph>
      <Divider />

      <Title strong level={3}>
        2023-06-05
      </Title>
      <Paragraph className="changelog-p">
        <ul>
          <li>🎉 留言板迁移至 Artalk 评论系统</li>
        </ul>
      </Paragraph>
      <Divider />

      <Title strong level={3}>
        2024-01-02
      </Title>
      <Paragraph className="changelog-p">
        <ul>
          <li>🎉 新增绑定玩家功能</li>
          <li>🎉 展示玩家基础信息</li>
          <li>🎉 展示玩家已拥有击杀环 & M章</li>
        </ul>
      </Paragraph>
      <Divider />
    </Typography>
  );
}

export default Changelogs;
