import { useState, useLayoutEffect } from 'react'
import { Tag, Card, Comment, Tooltip, List } from 'antd';

import './index.less';

function MessageBoard() {
  useLayoutEffect(() => {
    twikoo.init({
      envId: 'https://twikoo-wot.src.moe',
      el: '#twikoo-comment',
      lang: 'zh-CN',
    })
  }, [])

  return (
    <Card className="comment-card-container">
      <div id="twikoo-comment"></div>
    </Card>
  )
}

export default MessageBoard;
