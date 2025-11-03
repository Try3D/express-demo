import { useState, useEffect, useCallback } from "react";
import ApiService from "../services/api";
import ProductFilters from "../components/customer/ProductFilters";
import ProductGrid from "../components/customer/ProductGrid";
import { useCart } from "../hooks/useCart";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, notification } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          ApiService.getProducts(),
          ApiService.getCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setFilteredProducts(productsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilter = useCallback(
    ({ categoryId, search }) => {
      let filtered = products;

      if (categoryId) {
        filtered = filtered.filter(
          (product) => product.categoryId === parseInt(categoryId),
        );
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            (product.name &&
              product.name.toLowerCase().includes(searchLower)) ||
            (product.description &&
              product.description.toLowerCase().includes(searchLower)) ||
            (product.categoryName &&
              product.categoryName.toLowerCase().includes(searchLower)),
        );
      }

      setFilteredProducts(filtered);
    },
    [products],
  );

  const handleAddToCart = (product) => {
    addToCart(product)
    // Notification is now handled by the CartContext
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="page-width">
          <div className="hero__inner">
            <div className="hero__content">
              <h1 className="hero__title">Discover Premium Products</h1>
              <p className="hero__subtitle">
                Curated collection of electronics, fashion, and lifestyle
                products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <ProductFilters categories={categories} onFilter={handleFilter} />

      {/* Products Grid */}
      <section className="collection">
        <div className="page-width">
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            error={error}
            onAddToCart={handleAddToCart}
          />
          
          {/* Notification */}
          {notification && (
            <div style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: notification.includes('Cannot') ? 'var(--color-error)' : 'var(--color-success)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.4rem',
              zIndex: 1001,
              fontWeight: 500
            }}>
              {notification}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;

