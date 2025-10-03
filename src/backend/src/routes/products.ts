import express from 'express';
import Product from '../models/Product';

const router = express.Router();

// Mock data for immediate functionality
const mockProducts = [
  {
    id: '1',
    name: 'DevOps Handbook',
    description: 'The definitive guide to DevOps practices and principles',
    price: 29.99,
    category: 'Books',
    image: 'https://via.placeholder.com/300x300?text=DevOps+Handbook',
    stock: 50,
    rating: 4.8,
    numReviews: 245,
    isActive: true,
  },
  {
    id: '2',
    name: 'Docker T-Shirt',
    description: 'Comfortable cotton t-shirt with Docker logo',
    price: 24.99,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=Docker+TShirt',
    stock: 100,
    rating: 4.5,
    numReviews: 89,
    isActive: true,
  },
  {
    id: '3',
    name: 'Kubernetes Mug',
    description: 'Premium ceramic mug perfect for your morning coffee',
    price: 15.99,
    category: 'Office',
    image: 'https://via.placeholder.com/300x300?text=K8s+Mug',
    stock: 75,
    rating: 4.7,
    numReviews: 156,
    isActive: true,
  },
];

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    // Try to get from database first, fallback to mock data
    let products;
    try {
      products = await Product.find({ isActive: true });
      if (products.length === 0) {
        products = mockProducts;
      }
    } catch (dbError) {
      // Database not available, use mock data
      console.log('Database not available, using mock data:', dbError);
      products = mockProducts;
    }

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    let product;
    try {
      product = await Product.findById(req.params.id);
    } catch (dbError) {
      // Database not available, use mock data
      console.log('Database not available, using mock data:', dbError);
      product = mockProducts.find(p => p.id === req.params.id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
});

export default router;
