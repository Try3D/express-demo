import { X } from 'lucide-react'
import { useCart } from '../../hooks/useCart'

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity))
  }

  const handleClearCart = () => {
    if (cart.length === 0) return
    
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart()
    }
  }

  return (
    <div className={`cart-drawer ${isOpen ? 'active' : ''}`}>
      <div className="cart-drawer__overlay" onClick={handleOverlayClick}></div>
      <div className="cart-drawer__inner">
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Shopping Cart</h2>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Close cart">
            <X size={18} />
          </button>
        </div>
        
        <div className="cart-drawer__items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item__image">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                <div className="cart-item__details">
                  <div className="cart-item__title">{item.name}</div>
                  <div className="cart-item__price">${item.price.toFixed(2)} each</div>
                  <div className="cart-item__quantity">
                    <input 
                      type="number" 
                      value={item.quantity} 
                      min="1" 
                       max={item.stock}
                      className="quantity-input"
                      onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                    />
                    <button 
                      className="cart-item__remove" 
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="cart-drawer__footer">
          <div className="cart-drawer__total">
            {cart.length > 0 && `Total: $${cartTotal.toFixed(2)}`}
          </div>
          <button className="btn btn--full" onClick={handleClearCart}>Clear Cart</button>
        </div>
      </div>
    </div>
  )
}

export default CartDrawer