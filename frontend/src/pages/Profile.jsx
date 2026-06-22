import { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Table, Switch, Tag, message, Row, Col, Divider } from 'antd'
import { UserOutlined, PhoneOutlined, EnvironmentOutlined, StarFilled, SaveOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { getProfile, updateProfile, getAddresses, saveAddress, deleteAddress } from '../api'

export default function Profile() {
  const [profile, setProfile] = useState({})
  const [addresses, setAddresses] = useState([])
  const [form] = Form.useForm()
  const [addrForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const p = await getProfile()
      setProfile(p)
      form.setFieldsValue(p)
      setAddresses(await getAddresses())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const saveProfile = async values => {
    await updateProfile(values)
    localStorage.setItem('nickname', values.nickname)
    message.success('资料已更新')
    load()
  }

  const saveAddr = async values => {
    await saveAddress({ ...values, isDefault: values.isDefault ? 1 : 0 })
    message.success('地址已保存')
    addrForm.resetFields()
    load()
  }

  const removeAddr = async id => {
    await deleteAddress(id)
    message.success('已删除')
    load()
  }

  const addrColumns = [
    {
      title: '收件人',
      dataIndex: 'receiver',
      width: 140,
      render: (v, row) => (
        <span style={{ fontWeight: 500 }}>
          {row.isDefault ? <Tag color="blue">默认</Tag> : null} {v}
        </span>
      )
    },
    { title: '电话', dataIndex: 'phone', width: 140 },
    { title: '地址', dataIndex: 'detail' },
    {
      title: '操作',
      width: 120,
      render: (_, row) => (
        <Button type="link" danger icon={<DeleteOutlined />} onClick={() => removeAddr(row.addressId)}>删除</Button>
      )
    }
  ]

  return (
    <div>
      <Card className="page-card" title={<><UserOutlined style={{ color: '#2563eb', marginRight: 8 }} /> 个人资料</>} style={{ marginBottom: 24 }}>
        <Row gutter={48}>
          <Col lg={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32, padding: 24, background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)', borderRadius: 12 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #10b981)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700 }}>
                {(profile.nickname || 'U')[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{profile.nickname || '未设置昵称'}</div>
                <div style={{ fontSize: 14, color: '#64748b', marginTop: 6 }}>学号：{profile.studentNo}</div>
                <div style={{ marginTop: 12 }}>
                  <Tag color="gold" style={{ padding: '6px 14px', fontSize: 14, borderRadius: 8 }}>
                    <StarFilled /> 信誉分 {profile.creditScore ?? 100}
                  </Tag>
                </div>
              </div>
            </div>

            <Form form={form} layout="vertical" onFinish={saveProfile}>
              <Form.Item name="nickname" label={<><UserOutlined style={{ marginRight: 4 }} /> 昵称</>} rules={[{ required: true }]}>
                <Input size="large" placeholder="请输入昵称" />
              </Form.Item>
              <Form.Item name="phone" label={<><PhoneOutlined style={{ marginRight: 4 }} /> 手机号</>}>
                <Input size="large" placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item name="college" label={<><EnvironmentOutlined style={{ marginRight: 4 }} /> 院系</>}>
                <Input size="large" placeholder="请输入所在院系" />
              </Form.Item>
              <Button type="primary" size="large" htmlType="submit" icon={<SaveOutlined />}>保存资料</Button>
            </Form>
          </Col>

          <Col lg={12}>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, height: '100%' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>📋 账户信息</h3>
              <Row gutter={[16, 12]}>
                <Col span={24}><span style={{ color: '#64748b' }}>邮箱：</span><strong>{profile.email || '—'}</strong></Col>
                <Col span={24}><span style={{ color: '#64748b' }}>注册时间：</span><strong>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('zh-CN') : '—'}</strong></Col>
                <Col span={24}><span style={{ color: '#64748b' }}>角色：</span><Tag color={profile.role === 1 ? 'blue' : 'default'}>{profile.role === 1 ? '管理员' : '普通用户'}</Tag></Col>
                <Col span={24}><span style={{ color: '#64748b' }}>账号状态：</span><Tag color="success">正常</Tag></Col>
              </Row>

              <Divider style={{ margin: '24px 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#fff', padding: 16, borderRadius: 8, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 13, color: '#64748b' }}>发布商品</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#2563eb', marginTop: 4 }}>—</div>
                </div>
                <div style={{ background: '#fff', padding: 16, borderRadius: 8, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 13, color: '#64748b' }}>交易订单</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981', marginTop: 4 }}>—</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card className="page-card" title={<><EnvironmentOutlined style={{ color: '#2563eb', marginRight: 8 }} /> 收货地址</>}>
        <Form form={addrForm} layout="vertical" onFinish={saveAddr} style={{ maxWidth: 640 }}>
          <Row gutter={16}>
            <Col lg={8}>
              <Form.Item name="receiver" label="收件人" rules={[{ required: true }]}>
                <Input size="large" placeholder="姓名" />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item name="phone" label="电话" rules={[{ required: true }]}>
                <Input size="large" placeholder="手机号" />
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item name="isDefault" label="是否默认" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="detail" label="详细地址" rules={[{ required: true }]}>
            <Input size="large" placeholder="省、市、区、街道、门牌号" />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>添加地址</Button>
        </Form>

        <Divider style={{ margin: '24px 0' }} />

        {addresses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <div className="empty-title">暂无收货地址</div>
            <div className="empty-desc">添加一个收货地址，方便邮寄交易</div>
          </div>
        ) : (
          <Table rowKey="addressId" dataSource={addresses} columns={addrColumns} pagination={false} />
        )}
      </Card>
    </div>
  )
}
