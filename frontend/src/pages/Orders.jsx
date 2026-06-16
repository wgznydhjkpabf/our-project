import { useEffect, useState } from 'react'
import { Card, Table, Button, Modal, Rate, Input, message } from 'antd'
import { getOrders, confirmOrder, cancelOrder, completeOrder, reviewOrder, getAuth, statusText } from '../api'

export default function Orders() {
  const { userId } = getAuth()
  const [orders, setOrders] = useState([])
  const [open, setOpen] = useState(false)
  const [review, setReview] = useState({ orderId: null, rating: 5, content: '' })

  const load = async () => setOrders(await getOrders())
  useEffect(() => { load() }, [])

  const isSeller = row => row.sellerId === Number(userId)
  const isBuyer = row => row.buyerId === Number(userId)

  const submitReview = async () => {
    await reviewOrder(review)
    message.success('评价成功')
    setOpen(false)
    load()
  }

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', width: 180 },
    { title: '商品', dataIndex: 'goodsTitle' },
    { title: '金额', dataIndex: 'amount', width: 90 },
    { title: '状态', dataIndex: 'status', width: 100, render: s => statusText.order[s] },
    {
      title: '操作', width: 320,
      render: (_, row) => (
        <>
          {isSeller(row) && row.status === 0 && (
            <Button size="small" onClick={async () => { await confirmOrder(row.orderId); message.success('已确认'); load() }}>确认</Button>
          )}
          {row.status < 2 && (
            <Button size="small" onClick={async () => { await cancelOrder(row.orderId); message.success('已取消'); load() }}>取消</Button>
          )}
          {row.status === 1 && (
            <Button size="small" type="primary" onClick={async () => { await completeOrder(row.orderId); message.success('订单完成'); load() }}>完成</Button>
          )}
          {isBuyer(row) && row.status === 2 && (
            <Button size="small" onClick={() => { setReview({ orderId: row.orderId, rating: 5, content: '' }); setOpen(true) }}>评价</Button>
          )}
        </>
      )
    }
  ]

  return (
    <Card className="page-card" title="我的订单">
      <Table rowKey="orderId" dataSource={orders} columns={columns} pagination={false} />
      <Modal title="订单评价" open={open} onCancel={() => setOpen(false)} onOk={submitReview}>
        <Rate value={review.rating} onChange={v => setReview({ ...review, rating: v })} />
        <Input.TextArea rows={3} placeholder="评价内容" style={{ marginTop: 12 }} value={review.content} onChange={e => setReview({ ...review, content: e.target.value })} />
      </Modal>
    </Card>
  )
}
