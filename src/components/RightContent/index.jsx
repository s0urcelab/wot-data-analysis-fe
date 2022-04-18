import { useState } from 'react'
import { Image, Modal, Button, Space, Badge } from 'antd';
import { Link } from 'umi';

const NOW_VERSION = 3

const GlobalHeaderRight = () => {
  const isRead = JSON.parse(window.localStorage['WOT_CHANGELOG_VER'] || 0) === NOW_VERSION
  const readIt = () => {
    window.localStorage['WOT_CHANGELOG_VER'] = NOW_VERSION
  }
  const [isModalVisible, setIsModalVisible] = useState(false);


  return (
    <Space>
      <Button
        type="link"
        onClick={() => setIsModalVisible(true)}
      >
        捐助我们
      </Button>
      <Badge
        dot
        count={+!isRead}
        onClick={readIt}
      >
        <Link to="/changelogs">更新日志</Link>
      </Badge>
      <Modal
        title="❤ 请我喝奶茶"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Image
          src="/qrcode.png"
          preview={false}
        />
      </Modal>
    </Space>
  );
};

export default GlobalHeaderRight;
