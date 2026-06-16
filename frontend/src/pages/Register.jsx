import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, message } from 'antd'
import { register } from '../api'

export default function Register() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const submit = async values => {
    await register(values)
    message.success('注册成功，请登录')
    navigate('/login')
  }

  return (
    <Card className="page-card auth-card" title="注册" style={{ maxWidth: 480 }}>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="studentNo" label="学号" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="college" label="院系">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, min: 6 }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>注册</Button>
      </Form>
    </Card>
  )
}
