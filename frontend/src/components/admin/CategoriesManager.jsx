import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import ApiService from '../../services/api'

const CategoriesManager = ({ onStatusChange }) => {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const { adminKey, isLoading } = useAuth()

  useEffect(() => {
    // Only load data when adminKey is available and auth is not loading
    if (!isLoading && adminKey) {
      loadCategories()
    }
  }, [adminKey, isLoading])

  const loadCategories = async () => {
    try {
      const categoriesData = await ApiService.getCategories()
      setCategories(categoriesData)
    } catch (error) {
      onStatusChange('Error loading categories', 'error')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await ApiService.createCategory(formData, adminKey)
      onStatusChange('Category added successfully!', 'success')
      setFormData({ name: '', description: '' })
      loadCategories()
    } catch (error) {
      onStatusChange(`Error: ${error.message}`, 'error')
    }
  }

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    
    try {
      await ApiService.deleteCategory(categoryId, adminKey)
      onStatusChange('Category deleted successfully!', 'success')
      loadCategories()
    } catch (error) {
      onStatusChange(`Error: ${error.message}`, 'error')
    }
  }

  return (
    <>
      <div className="admin-form">
        <h3>Add New Category</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="form-group">
              <label htmlFor="category-name">Category Name:</label>
              <input 
                type="text" 
                id="category-name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="category-description">Description:</label>
              <input 
                type="text" 
                id="category-description" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Add Category</button>
          </div>
        </form>
      </div>

      <h3>All Categories</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description || ''}</td>
              <td>
                <button 
                  className="btn-danger" 
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default CategoriesManager