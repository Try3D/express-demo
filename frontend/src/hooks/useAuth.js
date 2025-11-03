import { useState, useEffect } from 'react'
import ApiService from '../services/api'

export const useAuth = () => {
  const [adminKey, setAdminKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkStoredAuth = async () => {
      const savedKey = localStorage.getItem('adminKey')
      if (savedKey) {
        try {
          // Validate the stored key is still valid
          const isValid = await ApiService.validateAdminKey(savedKey)
          if (isValid) {
            setAdminKey(savedKey)
            setIsAuthenticated(true)
          } else {
            // Invalid key, remove it
            localStorage.removeItem('adminKey')
          }
        } catch (error) {
          // Network error, assume key is valid for offline use
          setAdminKey(savedKey)
          setIsAuthenticated(true)
        }
      }
      setIsLoading(false) // Auth check complete
    }

    checkStoredAuth()
  }, [])

  const login = (key) => {
    setAdminKey(key)
    setIsAuthenticated(true)
    localStorage.setItem('adminKey', key)
  }

  const logout = () => {
    setAdminKey('')
    setIsAuthenticated(false)
    localStorage.removeItem('adminKey')
  }

  return {
    adminKey,
    isAuthenticated,
    isLoading,
    login,
    logout
  }
}