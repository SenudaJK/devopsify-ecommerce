// MongoDB initialization script for Docker
// This script runs when the MongoDB container starts for the first time

// Switch to the devopsify-ecommerce database
db = db.getSiblingDB('devopsify-ecommerce');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: {
          bsonType: 'string',
          maxLength: 50,
          description: 'User name is required and must be a string with max 50 characters'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Email must be a valid email address'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'Password is required and must be at least 6 characters'
        },
        role: {
          enum: ['user', 'admin'],
          description: 'Role must be either user or admin'
        }
      }
    }
  }
});

db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'description', 'price', 'category'],
      properties: {
        name: {
          bsonType: 'string',
          maxLength: 100,
          description: 'Product name is required'
        },
        description: {
          bsonType: 'string',
          maxLength: 500,
          description: 'Product description is required'
        },
        price: {
          bsonType: 'number',
          minimum: 0,
          maximum: 100000,
          description: 'Price must be a positive number'
        },
        category: {
          enum: ['Electronics', 'Accessories', 'Office', 'Home', 'Sports', 'Books'],
          description: 'Category must be one of the predefined values'
        },
        stock: {
          bsonType: 'number',
          minimum: 0,
          description: 'Stock must be a non-negative number'
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

db.products.createIndex({ name: 'text', description: 'text' });
db.products.createIndex({ category: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ rating: -1 });
db.products.createIndex({ createdAt: -1 });

// Insert sample data
const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and long battery life',
    price: 79.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x300?text=Headphones',
    stock: 15,
    rating: 4.5,
    numReviews: 125,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Smartphone Case',
    description: 'Durable protective case for smartphones with shock absorption',
    price: 24.99,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=Phone+Case',
    stock: 50,
    rating: 4.2,
    numReviews: 89,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Ergonomic Laptop Stand',
    description: 'Aluminum laptop stand for better posture and workspace organization',
    price: 49.99,
    category: 'Office',
    image: 'https://via.placeholder.com/300x300?text=Laptop+Stand',
    stock: 8,
    rating: 4.7,
    numReviews: 67,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Wireless Mouse',
    description: 'Precision wireless mouse with ergonomic design and long battery life',
    price: 34.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x300?text=Mouse',
    stock: 25,
    rating: 4.3,
    numReviews: 156,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'USB-C Hub',
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, and power delivery',
    price: 59.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x300?text=USB+Hub',
    stock: 12,
    rating: 4.4,
    numReviews: 98,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Bamboo Desk Organizer',
    description: 'Eco-friendly bamboo desk organizer with multiple compartments',
    price: 19.99,
    category: 'Office',
    image: 'https://via.placeholder.com/300x300?text=Organizer',
    stock: 30,
    rating: 4.1,
    numReviews: 43,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.products.insertMany(sampleProducts);

// Create admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@devopsify.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/LmxLpBi.C', // bcrypt hash of 'admin123'
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const demoUser = {
  name: 'Demo User',
  email: 'demo@devopsify.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/LmxLpBi.C', // bcrypt hash of 'demo123'
  role: 'user',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

db.users.insertMany([adminUser, demoUser]);

print('Database initialized successfully with sample data!');
print('Demo users created:');
print('- Admin: admin@devopsify.com / admin123');
print('- User: demo@devopsify.com / demo123');
