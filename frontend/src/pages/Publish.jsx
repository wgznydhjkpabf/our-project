import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, InputNumber, Select, Rate, Upload, Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getCategories, publishGoods, uploadFile } from '../api'

export default function Publish() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [categories, setCategories] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  const customUpload = async ({ file, onSuccess, onError }) => {
    try {
      const url = await uploadFile(file)
      setImageUrls(prev => [...prev, url])
      onSuccess(url)
    } catch (e) {
      onError(e)
    }
  }

  const submit = async values => {
    await publishGoods({
      ...values,
      conditionLevel: values.conditionLevel || 3,
      images: JSON.stringify(imageUrls)
    })
    message.success('发布成功，等待管理员审核')
    navigate('/my-goods')
  }

  return (
    <Card className="page-card" title="发布商品">
      <Form form={form} layout="vertical" onFinish={submit} style={{ maxWidth: 640 }} initialValues={{ price: 1, conditionLevel: 3 }}>
        <Form.Item name="title" label="标题" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="categoryId" label="分类" rules={[{ required: true }]}>
          <Select options={categories.map(c => ({ value: c.categoryId, label: c.name }))} />
        </Form.Item>
        <Form.Item name="price" label="售价" rules={[{ required: true }]}>
          <InputNumber min={0.01} precision={2} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="originalPrice" label="原价">
          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="conditionLevel" label="成色">
          <Rate count={5} />
        </Form.Item>
        <Form.Item name="tradeLocation" label="交易地点">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="图片">
          <Upload listType="picture-card" customRequest={customUpload} fileList={fileList} onChange={({ fileList: fl }) => setFileList(fl)}>
            {fileList.length >= 5 ? null : (
              <div><PlusOutlined /><div style={{ marginTop: 8 }}>上传</div></div>
            )}
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit">提交审核</Button>
      </Form>
    </Card>
  )
}
