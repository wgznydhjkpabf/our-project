import request from './request'

export const login = data => request.post('/api/auth/login', data)
export const register = data => request.post('/api/auth/register', data)
export const getProfile = () => request.get('/api/auth/profile')
export const updateProfile = data => request.put('/api/auth/profile', data)

export const getCategories = () => request.get('/api/categories')
export const getGoodsList = params => request.get('/api/goods', { params })
export const getGoodsDetail = id => request.get(`/api/goods/${id}`)
export const publishGoods = data => request.post('/api/goods', data)
export const updateGoods = (id, data) => request.put(`/api/goods/${id}`, data)
export const offShelfGoods = id => request.put(`/api/goods/${id}/off-shelf`)

export const createOrder = data => request.post('/api/orders', data)
export const getOrders = () => request.get('/api/orders')
export const confirmOrder = id => request.put(`/api/orders/${id}/confirm`)
export const cancelOrder = id => request.put(`/api/orders/${id}/cancel`)
export const completeOrder = id => request.put(`/api/orders/${id}/complete`)
export const reviewOrder = data => request.post('/api/orders/review', data)

export const getMessages = () => request.get('/api/messages')
export const getConversation = peerId => request.get(`/api/messages/${peerId}`)
export const sendMessage = data => request.post('/api/messages', data)

export const getAddresses = () => request.get('/api/addresses')
export const saveAddress = data => request.post('/api/addresses', data)
export const deleteAddress = id => request.delete(`/api/addresses/${id}`)

export const uploadFile = file => {
  const form = new FormData()
  form.append('file', file)
  return request.post('/api/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const adminDashboard = () => request.get('/api/admin/dashboard')
export const adminUsers = () => request.get('/api/admin/users')
export const adminUpdateUserStatus = (id, status) =>
  request.put(`/api/admin/users/${id}/status`, null, { params: { status } })
export const adminPendingGoods = params => request.get('/api/admin/goods/pending', { params })
export const adminAuditGoods = (id, pass) =>
  request.put(`/api/admin/goods/${id}/audit`, null, { params: { pass } })
export const adminAddCategory = data => request.post('/api/admin/categories', data)
export const adminUpdateCategory = (id, data) => request.put(`/api/admin/categories/${id}`, data)
export const adminDeleteCategory = id => request.delete(`/api/admin/categories/${id}`)

export const getAuth = () => ({
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  nickname: localStorage.getItem('nickname'),
  role: Number(localStorage.getItem('role') || 0)
})

export const setAuth = data => {
  localStorage.setItem('token', data.token)
  localStorage.setItem('userId', data.userId)
  localStorage.setItem('nickname', data.nickname)
  localStorage.setItem('role', data.role)
}

export const clearAuth = () => localStorage.clear()

export const parseImages = images => {
  try {
    const arr = JSON.parse(images || '[]')
    return arr.length ? arr : ['https://via.placeholder.com/300x200?text=No+Image']
  } catch {
    return ['https://via.placeholder.com/300x200?text=No+Image']
  }
}

export const statusText = {
  goods: { 0: '待审核', 1: '在售', 2: '已售', 3: '已下架' },
  order: { 0: '待确认', 1: '待交易', 2: '已完成', 3: '已取消' }
}
