import { useState } from 'react'
import { Tag, Card, Comment, Tooltip, List } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { useRequest } from 'umi';
import API from '@/api'
import moment from 'moment';
import AddComment from './components/AddComment'

import './index.less';

function MessageBoard() {
  const [replyVisible, showReply] = useState(false)
  const [replyTo, setTo] = useState('')
  const [replyAt, setAt] = useState('')
  const [likes, setLikes] = useState(0)
  const [action, setAction] = useState(null)

  const {
    loading,
    run: fetchList,
    data = {},
  } = useRequest(() => API('/commentList', {
    method: 'GET',
  }))

  const { list = [], total = 0 } = data

  const like = () => {
    setLikes(1);
    setAction('liked');
  }

  const CommentItem = (props) => {
    const { _id, replyList, ...rest } = props
    const isTarget = (replyTo === _id) && replyVisible

    return (
      <Comment {...rest} onClick={() => setTo(_id)}>
        {
          (replyList.length || isTarget) && (
            <div className="sub-comment-container">
              {
                replyList.map(v => <Comment key={v._id} {...renderCommItem(v)} />)
              }
              {
                isTarget && (
                  <AddComment
                    to={replyTo}
                    at={replyAt}
                    success={() => { showReply(false); fetchList() }}
                  />
                )
              }
            </div>
          )
        }
      </Comment>
    )
  }

  const renderCommItem = (item, isMain = false) => ({
    ...item,
    actions: [
      // <Tooltip key="comment-basic-like" title="Like">
      //   <span onClick={like}>
      //     {
      //       action === 'liked'
      //         ? <LikeFilled />
      //         : <LikeOutlined />
      //     }
      //     <span className="comment-action">{likes}</span>
      //   </span>
      // </Tooltip>,
      <span onClick={() => { setAt(isMain ? '' : item._id); showReply(t => !t) }}>回复</span>,
    ],
    author: (
      <>
        {
          !!item.author_type && <Tag color="#87d068"><span className="comment-me">作者</span></Tag>
        }
        <span className="comment-username">{item.author}</span>
      </>

    ),
    avatar: item.author_type ? `https://blog.src.moe/img/avatar.jpg` : `https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${item.author}`,
    content: (
      <p>
        {
          item.at_text && <>回复<span className="at-someone">@{item.at_text}</span>：</>
        }
        {item.content}
      </p>
    ),
    datetime: (
      <Tooltip title={moment(item.date).format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment(item.date).fromNow()}</span>
      </Tooltip>
    ),
  })

  return (
    <Card className="comment-card-container">
      <AddComment success={fetchList} />
      <List
        rowKey="_id"
        className="comment-list"
        header={`${total} 条留言`}
        itemLayout="horizontal"
        dataSource={list.map(item => renderCommItem(item, true))}
        renderItem={item => <CommentItem {...item} />}
      />
    </Card>
  )
}

export default MessageBoard;
