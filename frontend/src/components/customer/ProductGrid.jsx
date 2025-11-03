import ProductCard from './ProductCard'

const ProductGrid = ({ products, isLoading, error, onAddToCart }) => {
  if (isLoading) {
    return (
      <div className="collection__loading" style={{ display: 'flex' }}>
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="collection__error" style={{ display: 'flex' }}>
        <p>Error loading products: {error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="cart-empty">
        <p>No products found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="collection-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}

export default ProductGrid