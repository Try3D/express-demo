const API_BASE = "http://localhost:3000/api";

class ApiService {
  // Products
  async getProducts() {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  }

  // Categories
  async getCategories() {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  }

  // Admin endpoints
  async getAdminProducts(adminKey) {
    const response = await fetch(`${API_BASE}/admin/products`, {
      headers: { "X-Admin-Key": adminKey },
    });
    if (!response.ok) throw new Error("Failed to fetch admin products");
    return response.json();
  }

  async createProduct(productData, adminKey) {
    const response = await fetch(`${API_BASE}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": adminKey,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create product");
    }
    return response.json();
  }

  async deleteProduct(productId, adminKey) {
    const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
      method: "DELETE",
      headers: { "X-Admin-Key": adminKey },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete product");
    }
    return response.json();
  }

  async createCategory(categoryData, adminKey) {
    const response = await fetch(`${API_BASE}/admin/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": adminKey,
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create category");
    }
    return response.json();
  }

  async deleteCategory(categoryId, adminKey) {
    const response = await fetch(`${API_BASE}/admin/categories/${categoryId}`, {
      method: "DELETE",
      headers: { "X-Admin-Key": adminKey },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete category");
    }
    return response.json();
  }



  // Admin authentication
  async validateAdminKey(adminKey) {
    const response = await fetch(`${API_BASE}/admin/products`, {
      headers: { "X-Admin-Key": adminKey },
    });
    return response.ok;
  }
}

export default new ApiService();

