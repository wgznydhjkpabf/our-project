import axios from 'axios'
import { message } from 'antd'

const request = axios.create({
  baseURL: '/',
  timeout: 15000
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  res => {
    const data = res.data
    if (data.code !== 200) {
      message.error(data.message || '请求失败')
      return Promise.reject(data)
    }
    return data.data
  },
  err => {
    message.error(err.response?.data?.message || err.message || '网络错误')
    return Promise.reject(err)
  }
)

export default request
