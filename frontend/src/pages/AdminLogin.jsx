import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ApiService from '../services/api'

const AdminLogin = () => {
  const [adminKey, setAdminKey] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!adminKey.trim()) {
      setError('Please enter admin key')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const isValid = await ApiService.validateAdminKey(adminKey)
      
      if (isValid) {
        login(adminKey)
        navigate('/admin/dashboard')
      } else {
        setError('Invalid admin key')
      }
    } catch (err) {
      setError('Error connecting to server')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="admin-key">Admin Key:</label>
          <input 
            type="password" 
            id="admin-key" 
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key"
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {error && (
          <div style={{ color: 'var(--color-error)', marginTop: '1rem' }}>
            {error}
          </div>
        )}
      </form>
    </div>
  )
}

export default AdminLogin