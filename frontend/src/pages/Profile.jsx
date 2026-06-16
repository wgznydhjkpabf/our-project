import { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Table, Switch, Tag, message } from 'antd'
import { getProfile, updateProfile, getAddresses, saveAddress, deleteAddress } from '../api'

export default function Profile() {
  const [profile, setProfile] = useState({})
  const [addresses, setAddresses] = useState([])
  const [form] = Form.useForm()
  const [addrForm] = Form.useForm()

  const load = async () => {
    const p = await getProfile()
    setProfile(p)
    form.setFieldsValue(p)
    setAddresses(await getAddresses())
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
    { title: '收件人', dataIndex: 'receiver' },
    { title: '电话', dataIndex: 'phone' },
    { title: '地址', dataIndex: 'detail' },
    { title: '操作', width: 100, render: (_, row) => <Button type="link" danger onClick={() => removeAddr(row.addressId)}>删除</Button> }
  ]

  return (
    <Card className="page-card" title="个人中心">
      <Form form={form} layout="vertical" onFinish={saveProfile} style={{ maxWidth: 520 }}>
        <Form.Item name="nickname" label="昵称"><Input /></Form.Item>
        <Form.Item name="phone" label="手机"><Input /></Form.Item>
        <Form.Item name="college" label="院系"><Input /></Form.Item>
        <Form.Item label="信誉分"><Tag color="success">{profile.creditScore}</Tag></Form.Item>
        <Button type="primary" htmlType="submit">保存资料</Button>
      </Form>

      <h3 style={{ marginTop: 32 }}>收货地址</h3>
      <Form form={addrForm} layout="vertical" onFinish={saveAddr} style={{ maxWidth: 520 }}>
        <Form.Item name="receiver" label="收件人" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="phone" label="电话" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="detail" label="地址" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="isDefault" label="默认" valuePropName="checked"><Switch /></Form.Item>
        <Button htmlType="submit">保存地址</Button>
      </Form>
      <Table rowKey="addressId" dataSource={addresses} columns={addrColumns} pagination={false} style={{ marginTop: 16 }} />
    </Card>
  )
}
