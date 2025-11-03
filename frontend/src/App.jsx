import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import CustomerLayout from './components/customer/CustomerLayout'
import AdminLayout from './components/admin/AdminLayout'
import HomePage from './pages/HomePage'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import './styles.css'

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<HomePage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminLogin />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App
