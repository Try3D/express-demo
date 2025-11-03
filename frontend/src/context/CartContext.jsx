import { createContext, useContext, useReducer, useEffect } from 'react'

// Initial cart state
const initialState = {
  cart: [],
  isLoading: false,
  notification: ''
}

// Cart action types
const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION'
}

// Cart reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        cart: action.payload
      }

    case CART_ACTIONS.ADD_TO_CART: {
      const product = action.payload
      const existingItem = state.cart.find(item => item.productId === product.id)
      
      if (existingItem) {
        // Check stock limit
        if (existingItem.quantity >= product.stock) {
          return {
            ...state,
            notification: 'Cannot add more items. Stock limit reached.'
          }
        }
        
        const updatedCart = state.cart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        
        return {
          ...state,
          cart: updatedCart,
          notification: 'Added to cart!'
        }
      } else {
        // Add new item to cart
        const newItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
          stock: product.stock
        }
        
        return {
          ...state,
          cart: [...state.cart, newItem],
          notification: 'Added to cart!'
        }
      }
    }

    case CART_ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.productId !== action.payload),
        notification: 'Item removed from cart'
      }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload
      
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.productId !== productId),
          notification: 'Item removed from cart'
        }
      }
      
      const updatedCart = state.cart.map(item => {
        if (item.productId === productId) {
          // Check stock limit
          if (quantity > item.stock) {
            return item // Don't update if exceeds stock
          }
          return { ...item, quantity }
        }
        return item
      })
      
      return {
        ...state,
        cart: updatedCart,
        notification: 'Quantity updated'
      }
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: [],
        notification: 'Cart cleared'
      }

    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    case CART_ACTIONS.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload
      }

    case CART_ACTIONS.CLEAR_NOTIFICATION:
      return {
        ...state,
        notification: ''
      }

    default:
      return state
  }
}

// Create CartContext
const CartContext = createContext()

// CartProvider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: CART_ACTIONS.SET_CART, payload: parsedCart })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.cart))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [state.cart])

  // Auto-clear notifications after 2 seconds
  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => {
        dispatch({ type: CART_ACTIONS.CLEAR_NOTIFICATION })
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [state.notification])

  // Action creators
  const actions = {
    addToCart: (product) => {
      dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: product })
      return !state.cart.find(item => 
        item.productId === product.id && item.quantity >= product.stock
      )
    },

    removeFromCart: (productId) => {
      dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: productId })
    },

    updateQuantity: (productId, quantity) => {
      dispatch({ 
        type: CART_ACTIONS.UPDATE_QUANTITY, 
        payload: { productId, quantity } 
      })
    },

    clearCart: () => {
      dispatch({ type: CART_ACTIONS.CLEAR_CART })
    },

    setNotification: (message) => {
      dispatch({ type: CART_ACTIONS.SET_NOTIFICATION, payload: message })
    },

    clearNotification: () => {
      dispatch({ type: CART_ACTIONS.CLEAR_NOTIFICATION })
    }
  }

  // Computed values
  const cartCount = state.cart.reduce((total, item) => total + item.quantity, 0)
  
  const cartTotal = state.cart.reduce(
    (total, item) => total + (item.price * item.quantity), 
    0
  )

  // Context value
  const value = {
    // State
    cart: state.cart,
    cartCount,
    cartTotal,
    isLoading: state.isLoading,
    notification: state.notification,
    
    // Actions
    ...actions
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  
  return context
}

export default CartContext