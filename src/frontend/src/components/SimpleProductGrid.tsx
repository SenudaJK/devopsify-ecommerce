import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CardActions,
  Fade,
  useTheme,
  Paper
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder,
  LocalOffer,
  Star,
  TrendingUp
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
  reviews?: number;
}

interface SimpleProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  loading?: boolean;
}

const SimpleProductGrid: React.FC<SimpleProductGridProps> = ({
  products,
  onAddToCart,
  loading = false
}) => {
  const theme = useTheme();
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filter and sort products
  const filteredProducts = products
    .filter(product => filterCategory === 'all' || product.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography>Loading products...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Modern Filters Section */}
      <Paper 
        elevation={0}
        sx={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box display="flex" gap={3} flexWrap="wrap" alignItems="center">
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel sx={{ color: 'text.secondary' }}>Category</InputLabel>
            <Select
              value={filterCategory}
              label="Category"
              onChange={(e) => setFilterCategory(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                },
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel sx={{ color: 'text.secondary' }}>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                },
              }}
            >
              <MenuItem value="name">Name A-Z</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ flexGrow: 1 }} />
          
          <Box display="flex" alignItems="center" gap={2}>
            <TrendingUp sx={{ color: 'primary.main' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {filteredProducts.length} Products
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Modern Products Grid */}
      <Grid container spacing={4}>
        {filteredProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Fade in timeout={300 + index * 100}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  background: 'rgba(30, 41, 59, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: '0 32px 64px -12px rgba(99, 102, 241, 0.4)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    '& .product-image': {
                      transform: 'scale(1.1)',
                    },
                    '& .add-to-cart-btn': {
                      transform: 'translateY(0)',
                      opacity: 1,
                    }
                  },
                  '&::before': {
                    content: '\"\"',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #6366f1, #f59e0b, #ec4899)',
                    zIndex: 1,
                  }
                }}
              >
                {/* Image Section */}
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={product.image}
                    alt={product.name}
                    className="product-image"
                    sx={{ 
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                  
                  {/* Favorite Button */}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(10px)',
                      color: favorites.has(product.id) ? '#ec4899' : 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.9)',
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    {favorites.has(product.id) ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>

                  {/* Category Badge */}
                  <Chip 
                    icon={<LocalOffer sx={{ fontSize: '16px !important' }} />}
                    label={product.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderRadius: 2,
                      '& .MuiChip-icon': {
                        color: 'white',
                      }
                    }}
                  />

                  {/* Stock Warning */}
                  {product.stock < 5 && product.stock > 0 && (
                    <Chip
                      label={`Only ${product.stock} left!`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.7 },
                        }
                      }}
                    />
                  )}
                </Box>
                
                {/* Content Section */}
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '3.6em',
                    }}
                  >
                    {product.name}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3, 
                      flexGrow: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.6,
                      minHeight: '3.2em',
                    }}
                  >
                    {product.description}
                  </Typography>
                  
                  {/* Rating Section */}
                  {product.rating && (
                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                      <Rating 
                        value={product.rating} 
                        precision={0.1} 
                        readOnly 
                        size="small"
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: '#f59e0b',
                          },
                          '& .MuiRating-iconEmpty': {
                            color: 'rgba(245, 158, 11, 0.3)',
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        ({product.reviews || 0} reviews)
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Price Section */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography 
                      variant="h4" 
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        letterSpacing: '-0.025em',
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {product.stock} in stock
                    </Typography>
                  </Box>
                </CardContent>
                
                {/* Action Section */}
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    disabled={product.stock === 0}
                    className="add-to-cart-btn"
                    sx={{
                      background: product.stock === 0 
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
                      color: product.stock === 0 ? 'text.secondary' : 'white',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1rem',
                      letterSpacing: '0.025em',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: 'translateY(4px)',
                      opacity: 0.8,
                      '&:hover': {
                        background: product.stock === 0 
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'linear-gradient(135deg, #4f46e5 0%, #d97706 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 16px 32px -8px rgba(99, 102, 241, 0.6)',
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.3)',
                      }
                    }}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardActions>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SimpleProductGrid;