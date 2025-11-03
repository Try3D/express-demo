import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import ApiService from '../../services/api'

const ProductsManager = ({ onStatusChange }) => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
    imageUrl: ''
  })
  const { adminKey, isLoading } = useAuth()

  useEffect(() => {
    // Only load data when adminKey is available and auth is not loading
    if (!isLoading && adminKey) {
      loadData()
    }
  }, [adminKey, isLoading])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        ApiService.getAdminProducts(adminKey),
        ApiService.getCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      onStatusChange('Error loading data', 'error')
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
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl || `https://via.placeholder.com/300x300?text=${encodeURIComponent(formData.name)}`
      }

      await ApiService.createProduct(productData, adminKey)
      onStatusChange('Product added successfully!', 'success')
      resetForm()
      loadData()
    } catch (error) {
      onStatusChange(`Error: ${error.message}`, 'error')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      stock: '',
      imageUrl: ''
    })
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    
    try {
      await ApiService.deleteProduct(productId, adminKey)
      onStatusChange('Product deleted successfully!', 'success')
      loadData()
    } catch (error) {
      onStatusChange(`Error: ${error.message}`, 'error')
    }
  }

  return (
    <>
      <div className="admin-form">
        <h3>Add New Product</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="form-group">
              <label htmlFor="product-name">Product Name:</label>
              <input 
                type="text" 
                id="product-name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="product-price">Price ($):</label>
              <input 
                type="number" 
                step="0.01" 
                id="product-price" 
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="product-category">Category:</label>
              <select 
                id="product-category" 
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="product-stock">Stock:</label>
              <input 
                type="number" 
                id="product-stock" 
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="product-description">Description:</label>
            <textarea 
              id="product-description" 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="product-image">Image URL:</label>
            <input 
              type="url" 
              id="product-image" 
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://..." 
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Add Product</button>
            <button type="button" className="btn btn--secondary" onClick={resetForm}>
              Clear Form
            </button>
          </div>
        </form>
      </div>

      <h3>All Products</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'
                  }}
                />
              </td>
              <td>{product.name}</td>
              <td>{product.categoryName || 'Unknown'}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
              <td>
                <button 
                  className="btn-danger" 
                  onClick={() => handleDelete(product.id)}
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

export default ProductsManager