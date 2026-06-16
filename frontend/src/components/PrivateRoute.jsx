import { Navigate, useLocation } from 'react-router-dom'
import { getAuth } from '../api'

export default function PrivateRoute({ children, admin = false }) {
  const { token, role } = getAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (admin && role !== 1) {
    return <Navigate to="/" replace />
  }
  return children
}
