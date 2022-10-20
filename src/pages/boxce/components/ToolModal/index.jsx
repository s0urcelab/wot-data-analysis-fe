import { useState } from 'react';
import { Typography, Alert, Result, Modal, message, Button, Upload } from 'antd';
import { useRequest } from 'umi';
import { CloudUploadOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import API, { api } from '@/api'

const { Text } = Typography;

export default function ToolModal(props) {
  const { visible, onClose } = props

  const [fileIds, setFileIds] = useState({})
  const [fileList, setFileList] = useState([])

  const {
    loading: uploading,
    run: doUpload,
    data: url,
  } = useRequest(params => API('/upload', {
    method: 'POST',
    data: params,
  }), {
    manual: true,
    onSuccess: () => {
      setFileList([])
    },
    onError: () => {
      message.error('处理失败！')
    },
  })

  const uploadProps = (type) => ({
    onChange: ({ file }) => {
      setFileIds({ ...fileIds, [file.uid]: type })
    },
    onRemove: file => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: file => {
      setFileList([...fileList, file])
      return false
    }
  })

  const handleUpload = () => {
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append(fileIds[file.uid], file)
    })

    doUpload(formData)
  }

  return (
    <Modal
      title="🛠 图标处理工具"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      <div>
        {
          !url && (
            <>
              <Alert
                type="warning"
                showIcon
                message={(
                  <>
                    请提取你所使用的图标插件中的<Text code>battleAtlas.dds</Text>、<Text code>battleAtlas.xml</Text>，
                    处理完成后，下载替换原文件即可。
                  </>
                )}
              />
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Upload {...uploadProps(`dds`)}>
                  <Button icon={<UploadOutlined />}>选择 battleAtlas.dds</Button>
                </Upload>
                <Upload {...uploadProps(`xml`)}>
                  <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>选择 battleAtlas.xml</Button>
                </Upload>
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  icon={<CloudUploadOutlined />}
                  onClick={handleUpload}
                  disabled={fileList.length < 2}
                  loading={uploading}
                  style={{ marginTop: 16 }}
                >
                  {uploading ? '处理中...' : '开始处理'}
                </Button>
              </div>
            </>
          )
        }
        {
          url && (
            <Result
              status="success"
              title="图标处理成功！"
              subTitle="请下载处理完成的图标文件并完成替换。"
              extra={[
                <Button
                  key="dds"
                  icon={<DownloadOutlined />}
                  href={api(`/download?n=${url}&t=dds`)}
                  target="_blank"
                >
                  下载 battleAtlas.dds
                </Button>,
                <Button
                  key="xml"
                  icon={<DownloadOutlined />}
                  href={api(`/download?n=${url}&t=xml`)}
                  target="_blank"
                >
                  下载 battleAtlas.xml
                </Button>,
              ]}
            />
          )
        }
      </div>
    </Modal>
  )
}
