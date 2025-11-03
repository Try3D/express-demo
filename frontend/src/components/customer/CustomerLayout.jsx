import { Outlet } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import Header from '../common/Header'

const CustomerLayout = () => {
  const { cartCount } = useCart()

  return (
    <div>
      <Header cartCount={cartCount} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default CustomerLayout