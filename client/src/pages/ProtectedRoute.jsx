import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.user)
  if (!user) {
    toast.warning('Please login to use this service!')
    return <Navigate to="/register" />
  }
  return children
}
export default ProtectedRoute
