import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  MenuItem,
  Skeleton,
} from '@mui/material';
import {
  AddShoppingCart,
  Star,
} from '@mui/icons-material';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  rating?: number;
}

interface ProductListProps {
  onAddToCart: (product: Product) => void;
  user: { id: string; email: string; name: string; token: string } | null;
}

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    description: 'High-quality wireless headphones with noise cancellation',
    image: 'https://via.placeholder.com/300x300?text=Headphones',
    category: 'Electronics',
    stock: 15,
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Smartphone Case',
    price: 24.99,
    description: 'Durable protective case for smartphones',
    image: 'https://via.placeholder.com/300x300?text=Phone+Case',
    category: 'Accessories',
    stock: 50,
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Laptop Stand',
    price: 49.99,
    description: 'Ergonomic aluminum laptop stand',
    image: 'https://via.placeholder.com/300x300?text=Laptop+Stand',
    category: 'Office',
    stock: 8,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Wireless Mouse',
    price: 34.99,
    description: 'Precision wireless mouse with long battery life',
    image: 'https://via.placeholder.com/300x300?text=Mouse',
    category: 'Electronics',
    stock: 25,
    rating: 4.3,
  },
  {
    id: '5',
    name: 'USB-C Hub',
    price: 59.99,
    description: 'Multi-port USB-C hub with HDMI and charging',
    image: 'https://via.placeholder.com/300x300?text=USB+Hub',
    category: 'Electronics',
    stock: 12,
    rating: 4.4,
  },
  {
    id: '6',
    name: 'Desk Organizer',
    price: 19.99,
    description: 'Bamboo desk organizer with multiple compartments',
    image: 'https://via.placeholder.com/300x300?text=Organizer',
    category: 'Office',
    stock: 30,
    rating: 4.1,
  },
];

const ProductList: React.FC<ProductListProps> = ({ onAddToCart, user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products
    .filter(product => filter === 'All' || product.category === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const renderSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Our Products
        </Typography>
        {renderSkeleton()}
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Our Products
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Category"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Sort By"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="price">Price: Low to High</MenuItem>
          <MenuItem value="priceDesc">Price: High to Low</MenuItem>
          <MenuItem value="rating">Rating</MenuItem>
        </TextField>
      </Box>

      {/* Products */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip label={product.category} size="small" />
                  {product.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ fontSize: 16, color: 'gold' }} />
                      <Typography variant="body2">{product.rating}</Typography>
                    </Box>
                  )}
                </Box>
                <Typography variant="h6" color="primary">
                  ${product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock: {product.stock}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddShoppingCart />}
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock === 0}
                  fullWidth
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredProducts.length === 0 && (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          No products found for the selected filter.
        </Typography>
      )}
    </Box>
  );
};

export default ProductList;
