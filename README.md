# Ecommerce API Demo

A simple RESTful API for managing products in an ecommerce platform. Built with Node.js and Express.js.

## Features

- ✅ Create, read, update, and delete products
- ✅ Input validation and error handling
- ✅ RESTful API design
- ✅ In-memory data storage (perfect for demos)
- ✅ JSON response format

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

### Production mode:
```bash
npm start
```

### Development mode (with auto-restart):
```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. Get API Information
- **GET** `/`
- **Description**: Get API information and available endpoints
- **Response**:
  ```json
  {
    "message": "Welcome to the Ecommerce API Demo",
    "version": "1.0.0",
    "endpoints": {
      "GET /products": "Get all products",
      "GET /products/:id": "Get a specific product",
      "POST /products": "Create a new product",
      "PUT /products/:id": "Update a product",
      "DELETE /products/:id": "Delete a product"
    }
  }
  ```

### 2. Get All Products
- **GET** `/products`
- **Description**: Retrieve all products
- **Response**:
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": "uuid-string",
        "name": "Sample Product 1",
        "description": "This is a sample product for demonstration",
        "price": 29.99,
        "category": "Electronics",
        "stock": 100,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

### 3. Get Single Product
- **GET** `/products/:id`
- **Description**: Retrieve a specific product by ID
- **Parameters**: 
  - `id` (URL parameter): Product ID
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid-string",
      "name": "Sample Product 1",
      "description": "This is a sample product for demonstration",
      "price": 29.99,
      "category": "Electronics",
      "stock": 100,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### 4. Create New Product
- **POST** `/products`
- **Description**: Create a new product
- **Request Body**:
  ```json
  {
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics",
    "stock": 25
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "data": {
      "id": "generated-uuid",
      "name": "New Product",
      "description": "Product description",
      "price": 99.99,
      "category": "Electronics",
      "stock": 25,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### 5. Update Product
- **PUT** `/products/:id`
- **Description**: Update an existing product
- **Parameters**: 
  - `id` (URL parameter): Product ID
- **Request Body** (all fields optional):
  ```json
  {
    "name": "Updated Product Name",
    "description": "Updated description",
    "price": 149.99,
    "category": "Updated Category",
    "stock": 50
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Product updated successfully",
    "data": {
      "id": "uuid-string",
      "name": "Updated Product Name",
      "description": "Updated description",
      "price": 149.99,
      "category": "Updated Category",
      "stock": 50,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T01:00:00.000Z"
    }
  }
  ```

### 6. Delete Product
- **DELETE** `/products/:id`
- **Description**: Delete a product
- **Parameters**: 
  - `id` (URL parameter): Product ID
- **Response**:
  ```json
  {
    "success": true,
    "message": "Product deleted successfully",
    "data": {
      "id": "uuid-string",
      "name": "Deleted Product",
      "description": "Product description",
      "price": 99.99,
      "category": "Electronics",
      "stock": 25,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

## Product Schema

Each product has the following properties:

- **id**: Unique identifier (UUID, auto-generated)
- **name**: Product name (required, string)
- **description**: Product description (required, string)
- **price**: Product price (required, number > 0)
- **category**: Product category (required, string)
- **stock**: Stock quantity (required, integer >= 0)
- **createdAt**: Creation timestamp (auto-generated)
- **updatedAt**: Last update timestamp (auto-updated)

## Error Handling

The API returns consistent error responses:

### Validation Error (400)
```json
{
  "success": false,
  "errors": [
    "Product name is required",
    "Valid product price is required (must be greater than 0)"
  ]
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": "Product not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error message",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Example Usage with curl

### Get all products:
```bash
curl http://localhost:3000/products
```

### Create a new product:
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop",
    "price": 1299.99,
    "category": "Electronics",
    "stock": 15
  }'
```

### Update a product:
```bash
curl -X PUT http://localhost:3000/products/your-product-id \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1199.99,
    "stock": 10
  }'
```

### Delete a product:
```bash
curl -X DELETE http://localhost:3000/products/your-product-id
```

## Project Structure

```
ecommerce-api-demo/
├── package.json
├── server.js              # Main server file
├── models/
│   └── Product.js         # Product model and service
└── README.md             # This file
```

## Technology Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **UUID**: For generating unique IDs
- **ES6 Modules**: Modern JavaScript module syntax

## Future Enhancements

- Add database integration (MongoDB, PostgreSQL, etc.)
- Add user authentication and authorization
- Add pagination for product listings
- Add product search and filtering
- Add product categories management
- Add order management
- Add comprehensive testing
- Add API rate limiting
- Add API documentation with Swagger/OpenAPI

## License

MIT