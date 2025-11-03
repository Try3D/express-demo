import express from "express";
import cors from "cors";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-key"],
  }),
);

app.use(express.json());
app.use(express.static("public"));

if (!fs.existsSync("data")) fs.mkdirSync("data");

function ensureFile(file, defaultValue = "[]") {
  if (!fs.existsSync(file)) fs.writeFileSync(file, defaultValue);
}

ensureFile("data/products.json");
ensureFile("data/categories.json");

function readFile(path) {
  try {
    const data = fs.readFileSync(path, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

function writeFile(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function adminAuth(req, res, next) {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== "admin123") {
    return res
      .status(401)
      .json({ message: "Unauthorized. Admin key required." });
  }
  next();
}

app.get("/api/products", (req, res) => {
  const products = readFile("data/products.json");
  const categories = readFile("data/categories.json");

  const productsWithCategories = products
    .filter((product) => product.stock > 0)
    .map((product) => {
      const category = categories.find((cat) => cat.id === product.categoryId);
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        categoryName: category ? category.name : "Unknown",
        imageUrl: product.imageUrl,
        stock: product.stock,
      };
    });

  res.json(productsWithCategories);
});

app.get("/api/products/:id", (req, res) => {
  const products = readFile("data/products.json");
  const categories = readFile("data/categories.json");
  const product = products.find((p) => p.id === req.params.id);

  if (!product || product.stock <= 0) {
    return res
      .status(404)
      .json({ message: "Product not found or out of stock" });
  }

  const category = categories.find((cat) => cat.id === product.categoryId);
  const productWithCategory = {
    ...product,
    categoryName: category ? category.name : "Unknown",
  };

  res.json(productWithCategory);
});

app.get("/api/categories", (req, res) => {
  res.json(readFile("data/categories.json"));
});

app.get("/api/admin/products", adminAuth, (req, res) => {
  const products = readFile("data/products.json");
  const categories = readFile("data/categories.json");

  const productsWithCategories = products.map((product) => {
    const category = categories.find((cat) => cat.id === product.categoryId);
    return {
      ...product,
      categoryName: category ? category.name : "Unknown",
    };
  });

  res.json(productsWithCategories);
});

app.post("/api/admin/products", adminAuth, (req, res) => {
  const products = readFile("data/products.json");
  const newProduct = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    categoryId: parseInt(req.body.categoryId),
    stock: parseInt(req.body.stock),
    imageUrl:
      req.body.imageUrl || "https://via.placeholder.com/300x300?text=Product",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  products.push(newProduct);
  writeFile("data/products.json", products);
  res.status(201).json(newProduct);
});

app.put("/api/admin/products/:id", adminAuth, (req, res) => {
  const products = readFile("data/products.json");
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    price: req.body.price ? parseFloat(req.body.price) : products[index].price,
    categoryId: req.body.categoryId
      ? parseInt(req.body.categoryId)
      : products[index].categoryId,
    stock: req.body.stock ? parseInt(req.body.stock) : products[index].stock,
    updatedAt: new Date().toISOString(),
  };

  writeFile("data/products.json", products);
  res.json(products[index]);
});

app.delete("/api/admin/products/:id", adminAuth, (req, res) => {
  const products = readFile("data/products.json");
  const updated = products.filter((p) => p.id !== req.params.id);

  if (products.length === updated.length) {
    return res.status(404).json({ message: "Product not found" });
  }

  writeFile("data/products.json", updated);
  res.json({ message: "Product deleted successfully" });
});

app.post("/api/admin/categories", adminAuth, (req, res) => {
  const categories = readFile("data/categories.json");
  const newCategory = {
    id: Date.now(),
    name: req.body.name,
    description: req.body.description || "",
  };

  categories.push(newCategory);
  writeFile("data/categories.json", categories);
  res.status(201).json(newCategory);
});

app.delete("/api/admin/categories/:id", adminAuth, (req, res) => {
  const categories = readFile("data/categories.json");
  const updated = categories.filter((c) => c.id != req.params.id);

  if (categories.length === updated.length) {
    return res.status(404).json({ message: "Category not found" });
  }

  writeFile("data/categories.json", updated);
  res.json({ message: "Category deleted successfully" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
