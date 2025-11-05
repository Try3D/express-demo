# Ecommerce API Demo

A full-stack ecommerce platform with RESTful API for product management and a React frontend. Built with Node.js, Express.js, and React.

## Features

- 🛍️ Customer product browsing and cart functionality
- 🔧 Admin product and category management
- 🔒 Admin authentication with API key
- 📱 Responsive React frontend
- 🛠️ RESTful API with JSON responses
- 💾 File-based data storage (perfect for demos)

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/try3d/express-demo
cd express-demo
```

### 2. Install Dependencies
```bash
# Install both backend and frontend dependencies
npm run install:all

# Or install separately:
npm install              # Backend dependencies
cd frontend && npm install  # Frontend dependencies
```

### 3. Start the Application

#### Option A: Start Both Servers (Recommended)
```bash
npm run dev:all
```
This starts both the API server (port 3000) and frontend dev server (port 5173) concurrently.

#### Option B: Start Servers Separately

**Backend API Server:**
```bash
npm run dev    # Development mode with auto-restart
# or
npm start      # Production mode
```

**Frontend Development Server:**
```bash
npm run frontend
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **Admin Panel**: http://localhost:5173/admin (Login with key: `admin123`)

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
Admin endpoints require the `x-admin-key` header with value `admin123`.

## Customer Endpoints

### Get All Products
**GET** `/api/products`

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:3000/api/products`
- Headers: None required

**Response:**
```json
[
  {
    "id": "uuid-string",
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop",
    "price": 1299.99,
    "categoryId": 1,
    "categoryName": "Electronics",
    "imageUrl": "https://via.placeholder.com/300x300?text=Product",
    "stock": 15
  }
]
```

### Get Single Product
**GET** `/api/products/:id`

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:3000/api/products/YOUR_PRODUCT_ID`
- Headers: None required

### Get All Categories
**GET** `/api/categories`

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:3000/api/categories`
- Headers: None required

**Response:**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and gadgets"
  }
]
```

## Admin Endpoints

### Get All Products (Admin)
**GET** `/api/admin/products`

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:3000/api/admin/products`
- Headers:
  - Key: `x-admin-key`
  - Value: `admin123`

### Create Product
**POST** `/api/admin/products`

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:3000/api/admin/products`
- Headers:
  - Key: `Content-Type`, Value: `application/json`
  - Key: `x-admin-key`, Value: `admin123`
- Body (raw JSON):
```json
{
  "name": "Gaming Mouse",
  "description": "High-precision gaming mouse with RGB lighting",
  "price": 79.99,
  "categoryId": 1,
  "stock": 50,
  "imageUrl": "https://via.placeholder.com/300x300?text=Gaming+Mouse"
}
```

### Update Product
**PUT** `/api/admin/products/:id`

**Postman Setup:**
- Method: `PUT`
- URL: `http://localhost:3000/api/admin/products/YOUR_PRODUCT_ID`
- Headers:
  - Key: `Content-Type`, Value: `application/json`
  - Key: `x-admin-key`, Value: `admin123`
- Body (raw JSON):
```json
{
  "name": "Updated Gaming Mouse",
  "price": 69.99,
  "stock": 25
}
```

### Delete Product
**DELETE** `/api/admin/products/:id`

**Postman Setup:**
- Method: `DELETE`
- URL: `http://localhost:3000/api/admin/products/YOUR_PRODUCT_ID`
- Headers:
  - Key: `x-admin-key`, Value: `admin123`

### Create Category
**POST** `/api/admin/categories`

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:3000/api/admin/categories`
- Headers:
  - Key: `Content-Type`, Value: `application/json`
  - Key: `x-admin-key`, Value: `admin123`
- Body (raw JSON):
```json
{
  "name": "Gaming Accessories",
  "description": "Gaming keyboards, mice, and other accessories"
}
```

### Delete Category
**DELETE** `/api/admin/categories/:id`

**Postman Setup:**
- Method: `DELETE`
- URL: `http://localhost:3000/api/admin/categories/CATEGORY_ID`
- Headers:
  - Key: `x-admin-key`, Value: `admin123`

## Product Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Auto-generated | UUID identifier |
| `name` | string | Yes | Product name |
| `description` | string | Yes | Product description |
| `price` | number | Yes | Product price |
| `categoryId` | number | Yes | Category ID reference |
| `stock` | number | Yes | Available quantity |
| `imageUrl` | string | Optional | Product image URL |
| `createdAt` | string | Auto-generated | ISO timestamp |
| `updatedAt` | string | Auto-updated | ISO timestamp |

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized. Admin key required."
}
```

### 404 Not Found
```json
{
  "message": "Product not found"
}
```

### 404 Product Out of Stock
```json
{
  "message": "Product not found or out of stock"
}
```

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start API server in production mode |
| `npm run dev` | Start API server in development mode |
| `npm run frontend` | Start frontend development server |
| `npm run dev:all` | Start both servers concurrently |
| `npm run install:all` | Install dependencies for both backend and frontend |
| `npm run frontend:build` | Build frontend for production |

## Project Structure

```
restful-api/
├── data/                      # JSON data files
│   ├── products.json
│   └── categories.json
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── package.json
├── models/
│   └── Product.js
├── public/                    # Static HTML files
├── index.js                   # Main API server
├── package.json
└── README.md
```

## Technology Stack

**Backend:**
- Node.js - Runtime environment
- Express.js - Web framework
- CORS - Cross-origin resource sharing
- UUID - Unique ID generation

**Frontend:**
- React 19 - UI framework
- Vite - Build tool and dev server
- React Router - Client-side routing
- Lucide React - Icons

## Development Tips

1. **Testing API endpoints**: Use Postman or similar tools with the examples above
2. **Admin access**: Use `admin123` as the `x-admin-key` header value
3. **Data persistence**: Data is stored in JSON files in the `data/` directory
4. **CORS**: The API allows all origins for development
5. **Hot reload**: Both servers support hot reload during development

## License

MIT
