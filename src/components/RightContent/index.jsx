import { Badge } from 'antd';
import { Link } from 'umi';

const GlobalHeaderRight = () => {
  return (
    <Badge
      dot
      // count={0}
    >
      <Link to="/changelogs">更新日志</Link>
    </Badge>
  );
};

export default GlobalHeaderRight;
