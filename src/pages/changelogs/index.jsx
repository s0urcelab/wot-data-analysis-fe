import { Typography, Divider } from 'antd';
import './index.less';

const { Title, Paragraph } = Typography;

function Changelogs() {
  return (
    <Typography>
      <Title>🔥 更新日志 Changelogs</Title>
      <Divider />

      <Title strong level={3}>2022-04-05</Title>
      <Paragraph className='changelog-p'>
        <ul>
          <li>🎉 击杀环标伤查询上线</li>
        </ul>
      </Paragraph>
      <Divider />

      <Title strong level={3}>2022-04-12</Title>
      <Paragraph className='changelog-p'>
        <ul>
          <li>🎉 新增排名变动情况</li>
          <li>⚙ 调整收录坦克列表</li>
          <li>⚙ 调整分页最大记录为100条</li>
        </ul>
      </Paragraph>
      <Divider />

      <Title strong level={3}>2022-04-15</Title>
      <Paragraph className='changelog-p'>
        <ul>
          <li>🎉 盒子战斗力纯净版 插件上线</li>
        </ul>
      </Paragraph>
      <Divider />
    </Typography>
  )
}

export default Changelogs;
