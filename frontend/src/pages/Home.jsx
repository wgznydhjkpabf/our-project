import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Select, Pagination, Card } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getCategories, getGoodsList, parseImages } from '../api'

export default function Home() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [list, setList] = useState([])
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState(undefined)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const size = 12

  const load = async (p = page, cat = categoryId, kw = keyword) => {
    const data = await getGoodsList({
      keyword: kw || undefined,
      categoryId: cat,
      status: 1,
      page: p,
      size
    })
    setList(data.list)
    setTotal(data.total)
  }

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    load(page, categoryId, keyword)
  }, [page, categoryId])

  const search = () => {
    setPage(1)
    load(1, categoryId, keyword)
  }

  return (
    <div>
      <Card className="page-card" style={{ marginBottom: 16 }}>
        <h1 style={{ marginTop: 0 }}>校园二手交易平台</h1>
        <p style={{ color: '#6b7280' }}>让闲置物品流动起来，省钱又环保</p>
        <Input.Search
          placeholder="搜索商品..."
          enterButton={<><SearchOutlined /> 搜索</>}
          size="large"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onSearch={search}
        />
      </Card>

      <Card className="page-card" style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="全部分类"
          style={{ width: 200 }}
          options={categories.map(c => ({ value: c.categoryId, label: c.name }))}
          value={categoryId}
          onChange={val => { setCategoryId(val); setPage(1) }}
        />
      </Card>

      <div className="goods-grid">
        {list.map(item => (
          <Card key={item.goodsId} className="goods-card" hoverable onClick={() => navigate(`/goods/${item.goodsId}`)} styles={{ body: { padding: 0 } }}>
            <img src={parseImages(item.images)[0]} alt={item.title} />
            <div className="goods-card-body">
              <h3 style={{ margin: 0 }}>{item.title}</h3>
              <div className="goods-price">¥ {item.price}</div>
              <div className="goods-meta">{item.categoryName} · {item.sellerNickname}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <Pagination current={page} pageSize={size} total={total} onChange={p => setPage(p)} />
      </div>
    </div>
  )
}
