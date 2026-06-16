import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Table, Button, message } from 'antd'
import { getGoodsList, offShelfGoods, getAuth, statusText } from '../api'

export default function MyGoods() {
  const navigate = useNavigate()
  const { userId } = getAuth()
  const [list, setList] = useState([])

  const load = async () => {
    const data = await getGoodsList({ userId, page: 1, size: 100 })
    setList(data.list)
  }

  useEffect(() => { load() }, [])

  const off = async id => {
    await offShelfGoods(id)
    message.success('已下架')
    load()
  }

  const columns = [
    { title: '标题', dataIndex: 'title' },
    { title: '价格', dataIndex: 'price', width: 100 },
    { title: '状态', dataIndex: 'status', width: 100, render: s => statusText.goods[s] },
    {
      title: '操作', width: 180,
      render: (_, row) => (
        <>
          <Button type="link" onClick={() => navigate(`/goods/${row.goodsId}`)}>查看</Button>
          {row.status === 1 && <Button type="link" danger onClick={() => off(row.goodsId)}>下架</Button>}
        </>
      )
    }
  ]

  return (
    <Card className="page-card" title="我的商品">
      <Table rowKey="goodsId" dataSource={list} columns={columns} pagination={false} />
    </Card>
  )
}
