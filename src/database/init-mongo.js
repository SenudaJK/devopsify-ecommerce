// MongoDB initialization script for DevOpsify E-commerce

// Switch to the application database
db = db.getSiblingDB('devopsify_ecommerce');

// Create application user with read/write permissions
db.createUser({
  user: "devopsify_user",
  pwd: "devopsify_password_2024",
  roles: [
    {
      role: "readWrite",
      db: "devopsify_ecommerce"
    }
  ]
});

console.log("✅ Created application user: devopsify_user");

// Create collections with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "name", "createdAt"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        password: {
          bsonType: "string",
          minLength: 6
        },
        name: {
          bsonType: "string",
          minLength: 2
        },
        role: {
          bsonType: "string",
          enum: ["user", "admin"]
        }
      }
    }
  }
});

db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "price", "category", "stock", "createdAt"],
      properties: {
        name: {
          bsonType: "string",
          minLength: 2
        },
        price: {
          bsonType: "number",
          minimum: 0
        },
        stock: {
          bsonType: "int",
          minimum: 0
        }
      }
    }
  }
});

db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "items", "totalAmount", "status", "createdAt"],
      properties: {
        totalAmount: {
          bsonType: "number",
          minimum: 0
        },
        status: {
          bsonType: "string",
          enum: ["pending", "processing", "shipped", "delivered", "cancelled"]
        }
      }
    }
  }
});

console.log("✅ Created collections with validation schemas");

// Insert sample categories
db.categories.insertMany([
  {
    _id: ObjectId(),
    name: "Electronics",
    description: "Electronic devices and gadgets",
    image: "/images/categories/electronics.jpg",
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Clothing",
    description: "Fashion and apparel",
    image: "/images/categories/clothing.jpg",
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Books",
    description: "Books and educational materials",
    image: "/images/categories/books.jpg",
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Home & Garden",
    description: "Home improvement and gardening",
    image: "/images/categories/home-garden.jpg",
    createdAt: new Date()
  }
]);

// Insert sample products
const electronicsCategory = db.categories.findOne({name: "Electronics"});
const clothingCategory = db.categories.findOne({name: "Clothing"});
const booksCategory = db.categories.findOne({name: "Books"});

db.products.insertMany([
  {
    _id: ObjectId(),
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 99.99,
    category: electronicsCategory._id,
    categoryName: "Electronics",
    stock: 50,
    images: ["/images/products/headphones-1.jpg", "/images/products/headphones-2.jpg"],
    features: ["Bluetooth 5.0", "30-hour battery", "Noise cancellation"],
    rating: 4.5,
    reviewCount: 128,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Smartphone - Latest Model",
    description: "Latest smartphone with advanced camera and processor",
    price: 699.99,
    category: electronicsCategory._id,
    categoryName: "Electronics",
    stock: 25,
    images: ["/images/products/smartphone-1.jpg", "/images/products/smartphone-2.jpg"],
    features: ["128GB Storage", "Triple Camera", "5G Ready"],
    rating: 4.7,
    reviewCount: 89,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Premium Cotton T-Shirt",
    description: "Comfortable premium cotton t-shirt in various colors",
    price: 29.99,
    category: clothingCategory._id,
    categoryName: "Clothing",
    stock: 100,
    images: ["/images/products/tshirt-1.jpg", "/images/products/tshirt-2.jpg"],
    features: ["100% Cotton", "Machine Washable", "Available in 5 colors"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.2,
    reviewCount: 45,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "DevOps Handbook - 2024 Edition",
    description: "Comprehensive guide to modern DevOps practices",
    price: 49.99,
    category: booksCategory._id,
    categoryName: "Books",
    stock: 30,
    images: ["/images/products/devops-book.jpg"],
    features: ["500+ pages", "Real-world examples", "Digital download included"],
    rating: 4.8,
    reviewCount: 67,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert demo users
db.users.insertMany([
  {
    _id: ObjectId(),
    name: "Demo User",
    email: "demo@devopsify.com",
    password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewvvxYh/VUF8.Deu", // hashed "demo123"
    role: "user",
    address: {
      street: "123 Demo Street",
      city: "DevOps City",
      state: "Cloud State",
      zipCode: "12345",
      country: "USA"
    },
    phone: "+1-555-0123",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Admin User",
    email: "admin@devopsify.com",
    password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewvvxYh/VUF8.Deu", // hashed "admin123"
    role: "admin",
    address: {
      street: "456 Admin Avenue",
      city: "DevOps City",
      state: "Cloud State",
      zipCode: "12345",
      country: "USA"
    },
    phone: "+1-555-0456",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.products.createIndex({ name: "text", description: "text" });
db.products.createIndex({ category: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ rating: -1 });
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });

console.log("✅ Inserted sample data and created indexes");
console.log("✅ Database initialization completed successfully!");

// Print summary
console.log("\n📊 Database Summary:");
console.log("Users:", db.users.countDocuments());
console.log("Products:", db.products.countDocuments());
console.log("Categories:", db.categories.countDocuments());
console.log("\n🔐 Demo Credentials:");
console.log("User: demo@devopsify.com / demo123");
console.log("Admin: admin@devopsify.com / admin123");
