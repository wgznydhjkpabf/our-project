import { useEffect, useState } from 'react'
import { Card, Row, Col, Table, Button, Form, Input, InputNumber, message } from 'antd'
import {
  adminDashboard, adminPendingGoods, adminAuditGoods,
  adminUsers, adminUpdateUserStatus, getCategories,
  adminAddCategory, adminDeleteCategory
} from '../api'

export default function Admin() {
  const [stats, setStats] = useState({})
  const [pending, setPending] = useState([])
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [form] = Form.useForm()

  const load = async () => {
    setStats(await adminDashboard())
    setPending((await adminPendingGoods({ page: 1, size: 50 })).list)
    setUsers(await adminUsers())
    setCategories(await getCategories())
  }

  useEffect(() => { load() }, [])

  const audit = async (id, pass) => {
    await adminAuditGoods(id, pass)
    message.success(pass ? '已通过' : '已驳回')
    load()
  }

  const toggleUser = async row => {
    await adminUpdateUserStatus(row.userId, row.status === 1 ? 0 : 1)
    message.success('状态已更新')
    load()
  }

  const addCategory = async values => {
    await adminAddCategory(values)
    form.resetFields()
    message.success('分类已添加')
    load()
  }

  const pendingColumns = [
    { title: '标题', dataIndex: 'title' },
    { title: '价格', dataIndex: 'price', width: 100 },
    { title: '卖家', dataIndex: 'sellerNickname', width: 120 },
    {
      title: '操作', width: 180,
      render: (_, row) => (
        <>
          <Button size="small" type="primary" onClick={() => audit(row.goodsId, true)}>通过</Button>
          <Button size="small" danger onClick={() => audit(row.goodsId, false)}>驳回</Button>
        </>
      )
    }
  ]

  const userColumns = [
    { title: '学号', dataIndex: 'studentNo' },
    { title: '昵称', dataIndex: 'nickname' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '状态', dataIndex: 'status', width: 100, render: s => s === 1 ? '正常' : '禁用' },
    {
      title: '操作', width: 120,
      render: (_, row) => row.role !== 1 ? (
        <Button size="small" onClick={() => toggleUser(row)}>{row.status === 1 ? '禁用' : '启用'}</Button>
      ) : null
    }
  ]

  const categoryColumns = [
    { title: '名称', dataIndex: 'name' },
    { title: '排序', dataIndex: 'sortOrder', width: 100 },
    {
      title: '操作', width: 120,
      render: (_, row) => (
        <Button type="link" danger onClick={async () => { await adminDeleteCategory(row.categoryId); message.success('已删除'); load() }}>删除</Button>
      )
    }
  ]

  return (
    <div>
      <Card className="page-card" title="管理后台">
        <Row gutter={16}>
          {[
            ['用户数', stats.userCount],
            ['商品数', stats.goodsCount],
            ['订单数', stats.orderCount],
            ['待审核', stats.pendingGoodsCount]
          ].map(([label, val]) => (
            <Col span={6} key={label}>
              <div className="stat-card"><span>{label}</span><strong>{val ?? 0}</strong></div>
            </Col>
          ))}
        </Row>
      </Card>

      <Card className="page-card" title="待审核商品" style={{ marginTop: 16 }}>
        <Table rowKey="goodsId" dataSource={pending} columns={pendingColumns} pagination={false} />
      </Card>

      <Card className="page-card" title="用户管理" style={{ marginTop: 16 }}>
        <Table rowKey="userId" dataSource={users} columns={userColumns} pagination={false} />
      </Card>

      <Card className="page-card" title="分类管理" style={{ marginTop: 16 }}>
        <Form form={form} layout="inline" onFinish={addCategory}>
          <Form.Item name="name" rules={[{ required: true }]}><Input placeholder="分类名称" /></Form.Item>
          <Form.Item name="sortOrder" initialValue={0}><InputNumber min={0} placeholder="排序" /></Form.Item>
          <Button type="primary" htmlType="submit">添加分类</Button>
        </Form>
        <Table rowKey="categoryId" dataSource={categories} columns={categoryColumns} pagination={false} style={{ marginTop: 12 }} />
      </Card>
    </div>
  )
}
