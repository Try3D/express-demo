import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ProductsManager from '../components/admin/ProductsManager'
import CategoriesManager from '../components/admin/CategoriesManager'

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('products')
  const [statusMessage, setStatusMessage] = useState('')
  const { isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Only redirect after auth loading is complete
    if (!isLoading && !isAuthenticated) {
      navigate('/admin')
    }
  }, [isAuthenticated, isLoading, navigate])

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  const showStatus = (message, type) => {
    setStatusMessage({ message, type })
    setTimeout(() => {
      setStatusMessage('')
    }, 5000)
  }

  const showSection = (section) => {
    setActiveSection(section)
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1>Loading...</h1>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>NEXUS Admin Dashboard</h1>
        <p style={{ textAlign: 'center', opacity: 0.9 }}>
          Manage your products, categories, and orders
        </p>
      </div>

      <div className="admin-nav">
        <button 
          onClick={() => showSection('products')} 
          className={activeSection === 'products' ? 'active' : ''}
        >
          Products
        </button>
        <button 
          onClick={() => showSection('categories')}
          className={activeSection === 'categories' ? 'active' : ''}
        >
          Categories
        </button>
        <button 
          onClick={handleLogout} 
          style={{ background: 'var(--color-error)' }}
        >
          Logout
        </button>
      </div>

      {statusMessage && (
        <div className={`status-message status-${statusMessage.type}`}>
          {statusMessage.message}
        </div>
      )}

      <div className={`admin-section ${activeSection === 'products' ? 'active' : ''}`}>
        {activeSection === 'products' && <ProductsManager onStatusChange={showStatus} />}
      </div>

      <div className={`admin-section ${activeSection === 'categories' ? 'active' : ''}`}>
        {activeSection === 'categories' && <CategoriesManager onStatusChange={showStatus} />}
      </div>
    </div>
  )
}

export default AdminDashboard