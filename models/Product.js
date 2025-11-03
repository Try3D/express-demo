import { v4 as uuidv4 } from 'uuid';

// Product model/schema
export class Product {
  constructor({ name, description, price, category, stock }) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.price = parseFloat(price);
    this.category = category;
    this.stock = parseInt(stock);
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Update product properties
  update(updates) {
    const allowedUpdates = ['name', 'description', 'price', 'category', 'stock'];
    
    for (const key of Object.keys(updates)) {
      if (allowedUpdates.includes(key)) {
        if (key === 'price') {
          this[key] = parseFloat(updates[key]);
        } else if (key === 'stock') {
          this[key] = parseInt(updates[key]);
        } else {
          this[key] = updates[key];
        }
      }
    }
    
    this.updatedAt = new Date().toISOString();
  }

  // Validate product data
  static validate(productData) {
    const errors = [];
    
    if (!productData.name || productData.name.trim().length === 0) {
      errors.push('Product name is required');
    }
    
    if (!productData.description || productData.description.trim().length === 0) {
      errors.push('Product description is required');
    }
    
    if (!productData.price || isNaN(parseFloat(productData.price)) || parseFloat(productData.price) <= 0) {
      errors.push('Valid product price is required (must be greater than 0)');
    }
    
    if (!productData.category || productData.category.trim().length === 0) {
      errors.push('Product category is required');
    }
    
    if (!productData.stock || isNaN(parseInt(productData.stock)) || parseInt(productData.stock) < 0) {
      errors.push('Valid stock quantity is required (must be 0 or greater)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Product service class for managing products
export class ProductService {
  constructor() {
    this.products = [
      new Product({
        name: 'Sample Product 1',
        description: 'This is a sample product for demonstration',
        price: 29.99,
        category: 'Electronics',
        stock: 100
      }),
      new Product({
        name: 'Sample Product 2',
        description: 'Another sample product',
        price: 49.99,
        category: 'Clothing',
        stock: 50
      })
    ];
  }

  // Get all products
  getAllProducts() {
    return this.products;
  }

  // Get product by ID
  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  // Create new product
  createProduct(productData) {
    const validation = Product.validate(productData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const product = new Product(productData);
    this.products.push(product);
    return { success: true, product };
  }

  // Update product
  updateProduct(id, updates) {
    const product = this.getProductById(id);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    const validation = Product.validate({ ...product, ...updates });
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    product.update(updates);
    return { success: true, product };
  }

  // Delete product
  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      return { success: false, error: 'Product not found' };
    }

    const deletedProduct = this.products.splice(index, 1)[0];
    return { success: true, product: deletedProduct };
  }
}