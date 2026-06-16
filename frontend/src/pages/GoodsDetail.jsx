import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Row, Col, Carousel, Button, Tag, Modal, Form, Radio, Input, message } from 'antd'
import { getGoodsDetail, createOrder, sendMessage, getAuth, parseImages, statusText } from '../api'

export default function GoodsDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, userId } = getAuth()
  const [goods, setGoods] = useState(null)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    getGoodsDetail(id).then(setGoods)
  }, [id])

  if (!goods) return null

  const images = parseImages(goods.images)

  const create = async values => {
    await createOrder({ goodsId: goods.goodsId, ...values })
    message.success('下单成功')
    setOpen(false)
    navigate('/my-orders')
  }

  const contactSeller = async () => {
    await sendMessage({
      receiverId: goods.userId,
      goodsId: goods.goodsId,
      content: `你好，我对「${goods.title}」感兴趣`
    })
    message.success('消息已发送')
    navigate('/messages')
  }

  return (
    <Card className="page-card">
      <Row gutter={24}>
        <Col span={10}>
          <Carousel autoplay>
            {images.map((img, idx) => (
              <div key={idx}><img src={img} alt="" style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 8 }} /></div>
            ))}
          </Carousel>
        </Col>
        <Col span={14}>
          <h1>{goods.title}</h1>
          <div className="goods-price" style={{ fontSize: 28 }}>¥ {goods.price}</div>
          <p>分类：{goods.categoryName}</p>
          <p>成色：{goods.conditionLevel} 成新</p>
          <p>交易地点：{goods.tradeLocation || '面议'}</p>
          <p>卖家：{goods.sellerNickname}（信誉 {goods.sellerCreditScore}）</p>
          <p>浏览量：{goods.viewCount}</p>
          {token && goods.status === 1 && goods.userId !== Number(userId) && (
            <div style={{ display: 'flex', gap: 12 }}>
              <Button type="primary" onClick={() => setOpen(true)}>立即购买</Button>
              <Button onClick={contactSeller}>联系卖家</Button>
            </div>
          )}
          {goods.status !== 1 && <Tag>{statusText.goods[goods.status]}</Tag>}
        </Col>
      </Row>
      <section style={{ marginTop: 24 }}>
        <h3>商品描述</h3>
        <p>{goods.description || '暂无描述'}</p>
      </section>

      <Modal title="创建订单" open={open} onCancel={() => setOpen(false)} footer={null}>
        <Form form={form} layout="vertical" initialValues={{ deliveryType: 0 }} onFinish={create}>
          <Form.Item name="deliveryType" label="交易方式">
            <Radio.Group>
              <Radio value={0}>面交</Radio>
              <Radio value={1}>邮寄</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.deliveryType !== cur.deliveryType}>
            {({ getFieldValue }) => getFieldValue('deliveryType') === 1 ? (
              <Form.Item name="address" label="收货地址" rules={[{ required: true }]}>
                <Input.TextArea rows={3} />
              </Form.Item>
            ) : null}
          </Form.Item>
          <Button type="primary" htmlType="submit" block>提交订单</Button>
        </Form>
      </Modal>
    </Card>
  )
}
