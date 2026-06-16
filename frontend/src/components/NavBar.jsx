import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button, Space } from 'antd'
import { getAuth, clearAuth } from '../api'

const { Header } = Layout

const navItems = [
  { key: '/', label: <Link to="/">首页</Link> },
  { key: '/publish', label: <Link to="/publish">发布商品</Link>, auth: true },
  { key: '/my-goods', label: <Link to="/my-goods">我的商品</Link>, auth: true },
  { key: '/orders', label: <Link to="/my-orders">我的订单</Link>, auth: true },
  { key: '/messages', label: <Link to="/messages">消息</Link>, auth: true },
  { key: '/admin', label: <Link to="/admin">管理后台</Link>, admin: true }
]

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, nickname, role } = getAuth()

  const items = navItems.filter(item => {
    if (item.admin) return token && role === 1
    if (item.auth) return !!token
    return true
  })

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: 'linear-gradient(90deg, #2563eb, #1d4ed8)' }}>
      <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginRight: 32 }}>
        <Link to="/" style={{ color: '#fff' }}>校园二手交易</Link>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname === '/my-orders' ? '/orders' : location.pathname]}
        items={items}
        style={{ flex: 1, background: 'transparent', borderBottom: 'none' }}
      />
      <Space>
        {token ? (
          <>
            <Link to="/profile" style={{ color: '#fff' }}>{nickname || '个人中心'}</Link>
            <Button type="link" danger style={{ color: '#fecaca' }} onClick={logout}>退出</Button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff' }}>登录</Link>
            <Link to="/register" style={{ color: '#fff' }}>注册</Link>
          </>
        )}
      </Space>
    </Header>
  )
}
