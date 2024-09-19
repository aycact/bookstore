import { MyNavbar } from '../../components'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'

const SharedLayout = () => {
  return (
    <main>
      <MyNavbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </main>
  )
}
export default SharedLayout
