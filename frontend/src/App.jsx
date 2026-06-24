import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import NavBar from './components/NavBar'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import GoodsDetail from './pages/GoodsDetail'
import Publish from './pages/Publish'
import MyGoods from './pages/MyGoods'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import MyFavorites from './pages/MyFavorites'
import Admin from './pages/Admin'

const { Content } = Layout

export default function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <NavBar />
        <Content className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/goods/:id" element={<GoodsDetail />} />
            <Route path="/publish" element={<PrivateRoute><Publish /></PrivateRoute>} />
            <Route path="/my-goods" element={<PrivateRoute><MyGoods /></PrivateRoute>} />
            <Route path="/my-orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
            <Route path="/my-favorites" element={<PrivateRoute><MyFavorites /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute admin><Admin /></PrivateRoute>} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  )
}
