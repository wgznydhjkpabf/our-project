import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getAuth, clearAuth } from '../api'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, nickname, role } = getAuth()
  const pathname = location.pathname

  const isActive = (key) => {
    if (key === '/orders') return pathname === '/my-orders' || pathname === '/orders'
    return pathname === key || pathname.startsWith(key + '/')
  }

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  const showPublish = token
  const showMyGoods = token
  const showOrders = token
  const showMessages = token
  const showAdmin = token && role === 1

  return (
    <div className="nav-header">
      <div className="nav-logo">
        <span className="logo-icon">🛒</span>
        <Link to="/" style={{ color: '#fff' }}>校园二手交易</Link>
      </div>

      <div className="nav-menu-wrapper">
        <nav className="nav-menu">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>🏠 首页</Link>
          {showPublish && (
            <Link to="/publish" className={`nav-link ${isActive('/publish') ? 'active' : ''}`}>✏️ 发布商品</Link>
          )}
          {showMyGoods && (
            <Link to="/my-goods" className={`nav-link ${isActive('/my-goods') ? 'active' : ''}`}>📦 我的商品</Link>
          )}
          {showOrders && (
            <Link to="/my-orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>📋 我的订单</Link>
          )}
          {showMessages && (
            <Link to="/messages" className={`nav-link ${isActive('/messages') ? 'active' : ''}`}>💬 消息</Link>
          )}
          {showAdmin && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>⚙️ 管理后台</Link>
          )}
        </nav>
      </div>

      <div className="nav-user-area">
        {token ? (
          <>
            <Link to="/profile" className="nav-link">👤 {nickname || '个人中心'}</Link>
            <span className="logout-btn" style={{ cursor: 'pointer' }} onClick={logout}>退出</span>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">登录</Link>
            <Link to="/register" className="nav-link" style={{ background: 'rgba(255,255,255,0.15)' }}>注册</Link>
          </>
        )}
      </div>
    </div>
  )
}
