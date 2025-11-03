import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Settings, ShoppingBag } from 'lucide-react'
import CartDrawer from './CartDrawer'

const Header = ({ cartCount, onCartToggle }) => {
  const [isCartOpen, setIsCartOpen] = useState(false)

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
    onCartToggle?.()
  }

  return (
    <>
      <header className="header">
        <div className="page-width">
          <div className="header__inner">
            <div className="header__heading">
              <h1 className="header__logo">
                <Link to="/" className="header__logo-link">NEXUS</Link>
              </h1>
            </div>
            
            <nav className="header__nav">
              <ul className="list-menu">
                <li><Link to="#" className="header__menu-item">All Products</Link></li>
                <li><Link to="#" className="header__menu-item">Electronics</Link></li>
                <li><Link to="#" className="header__menu-item">Fashion</Link></li>
                <li><Link to="#" className="header__menu-item">Home & Garden</Link></li>
              </ul>
            </nav>
            
            <div className="header__icons">
              <button className="header__icon header__icon--search" aria-label="Search">
                <Search size={20} />
              </button>
              <Link to="/admin" className="header__icon" aria-label="Admin Panel" title="Admin Panel">
                <Settings size={20} />
              </Link>
              <button className="header__icon header__icon--cart" aria-label="Open cart" onClick={toggleCart}>
                <ShoppingBag size={20} />
                <span className="cart-count" style={{ display: cartCount > 0 ? 'block' : 'none' }}>
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <CartDrawer isOpen={isCartOpen} onClose={toggleCart} />
    </>
  )
}

export default Header