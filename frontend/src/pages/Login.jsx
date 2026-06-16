import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, message } from 'antd'
import { login, setAuth } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const submit = async values => {
    const data = await login(values)
    setAuth(data)
    message.success('登录成功')
    navigate(data.role === 1 ? '/admin' : '/')
  }

  return (
    <Card className="page-card auth-card" title="登录">
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="account" label="账号" rules={[{ required: true, message: '请输入学号或邮箱' }]}>
          <Input placeholder="学号或邮箱" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>登录</Button>
        <p style={{ color: '#6b7280', fontSize: 13, marginTop: 12 }}>管理员账号：admin / admin123</p>
      </Form>
    </Card>
  )
}
