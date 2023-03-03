import React, { useState } from 'react'
import { Comment, Form, Button, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useRequest } from 'umi';
import API from '@/api'

const { TextArea } = Input;

const CACHE_AUTHOR = window.localStorage['WOT_COMMENT_CURR_AUTHOR']

const Editor = ({ onNameChange, onSubmit, submitting }) => {
  const [form] = Form.useForm()

  const onFinish = (val) => {
    // trim
    const values = {
      author: val.author.trim(),
      content: val.content.trim(),
    }
    onSubmit(values, form)
    window.localStorage['WOT_COMMENT_CURR_AUTHOR'] = values.author
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="author"
        initialValue={CACHE_AUTHOR}
        rules={[{ required: true, message: '请填写名字' }]}
      >
        <Input
          style={{ width: 300 }}
          placeholder="名字"
          prefix={<UserOutlined className="site-form-item-icon" />}
          onChange={e => onNameChange(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        name="content"
        rules={[{ required: true, message: '请输入留言' }]}
      >
        <TextArea
          placeholder="留言内容..."
          rows={4}
        />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          loading={submitting}
          type="primary"
        >
          发送留言
        </Button>
      </Form.Item>
    </Form>
  )
}

function AddComment({ to, at, success }) {
  const {
    loading,
    run,
  } = useRequest(params => API('/addComment', {
    method: 'POST',
    data: params,
  }), {
    manual: true,
    onSuccess: data => {
      message.success(data)
      success()
    },
    onError: () => message.error('留言失败！'),
  })

  const [ava, setAva] = useState(CACHE_AUTHOR)

  const onSubmit = (values, form) => {
    // 提交
    run({
      ...values,
      ...to && { reply_to: to },
      ...at && { at },
    })
    form.resetFields(['content'])
  }

  return (
    <Comment
      avatar={`https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${ava || Math.random()}`}
      content={
        <Editor
          onNameChange={name => setAva(name.trim())}
          onSubmit={onSubmit}
          submitting={loading}
        />
      }
    />
  )
}

export default AddComment
