import { Badge } from 'antd';
import { Link } from 'umi';

const NOW_VERSION = 1

const GlobalHeaderRight = () => {
  const isRead = JSON.parse(window.localStorage['WOT_CHANGELOG_VER'] || 0) === NOW_VERSION
  const readIt = () => {
    window.localStorage['WOT_CHANGELOG_VER'] = NOW_VERSION
  }

  return (
    <Badge
      dot
      count={+!isRead}
      onClick={readIt}
    >
      <Link to="/changelogs">更新日志</Link>
    </Badge>
  );
};

export default GlobalHeaderRight;
