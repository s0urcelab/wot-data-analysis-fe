import { Typography, Divider } from 'antd';
import './style.less';

const { Title, Paragraph } = Typography;

function Changelogs() {
  return (
    <Typography>
      <Title>🔥 更新日志 Changelogs</Title>
      <Divider />

      <Title strong level={3}>2022-04-05</Title>
      <Paragraph className='changelog-p'>
        <ul>
          <li>
          🎉 击杀环标伤上线
          </li>
        </ul>
      </Paragraph>
      <Divider />
    </Typography>
  )
}

export default Changelogs;
