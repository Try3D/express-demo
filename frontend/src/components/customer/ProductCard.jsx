const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product)
  }

  return (
    <div className="card">
      <div className="card__inner">
        <div className="card__media">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="card__image"
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`
            }}
          />
        </div>
        <div className="card__content">
          <h3 className="card__title">{product.name}</h3>
          <div className="card__price">${product.price.toFixed(2)}</div>
          <div className="card__description">{product.description}</div>
          <div className="card__actions">
            <button 
              className="btn" 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard