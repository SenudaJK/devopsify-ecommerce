import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography, Button } from '@mui/material';

// Import existing components
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Login from './components/Login';

// Import simple components
import SimpleNavbar from './components/SimpleNavbar';
import SimpleProductGrid from './components/SimpleProductGrid';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
  },
  shape: {
    borderRadius: 16,
  },
});

const sampleProducts = [
  {
    id: '1',
    name: 'MacBook Pro 16" M3 Max',
    price: 3499.99,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
    description: 'Professional laptop with M3 Max chip, 32GB RAM, and stunning Liquid Retina XDR display',
    category: 'Electronics',
    stock: 4,
    rating: 4.9,
    reviews: 2847
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    price: 1199.99,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    description: 'Latest iPhone with titanium design, advanced camera system, and A17 Pro chip',
    category: 'Electronics',
    stock: 12,
    rating: 4.8,
    reviews: 5692
  },
  {
    id: '3',
    name: 'PlayStation 5 Console',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop',
    description: 'Next-gen gaming console with 4K gaming, ray tracing, and ultra-fast SSD',
    category: 'Gaming',
    stock: 8,
    rating: 4.7,
    reviews: 3421
  },
  {
    id: '4',
    name: 'AirPods Pro (3rd Gen)',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop',
    description: 'Premium wireless earbuds with active noise cancellation and spatial audio',
    category: 'Electronics',
    stock: 25,
    rating: 4.6,
    reviews: 1829
  },
  {
    id: '5',
    name: 'Tesla Model Y Performance',
    price: 69990.00,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=400&fit=crop',
    description: 'All-electric SUV with dual motor AWD, autopilot, and premium interior',
    category: 'Automotive',
    stock: 2,
    rating: 4.9,
    reviews: 892
  },
  {
    id: '6',
    name: 'Canon EOS R6 Mark II',
    price: 2499.99,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop',
    description: 'Professional mirrorless camera with 24.2MP sensor and advanced autofocus',
    category: 'Photography',
    stock: 6,
    rating: 4.8,
    reviews: 1243
  },
  {
    id: '7',
    name: 'Nike Air Jordan 1 Retro',
    price: 170.00,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop',
    description: 'Iconic basketball shoes with classic design and premium leather construction',
    category: 'Fashion',
    stock: 15,
    rating: 4.5,
    reviews: 2156
  },
  {
    id: '8',
    name: 'DJI Mini 4 Pro Drone',
    price: 759.99,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop',
    description: 'Compact drone with 4K HDR video, intelligent flight modes, and 34-minute flight time',
    category: 'Electronics',
    stock: 3,
    rating: 4.7,
    reviews: 967
  }
];

export interface CartItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const addToCart = (product: any) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { 
          id: product.id, 
          name: product.name, 
          price: product.price, 
          description: product.description,
          image: product.image,
          category: product.category,
          stock: product.stock,
          quantity: 1
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleLogin = (user: User) => {
    setUser(user);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <SimpleNavbar
            cartItemsCount={getTotalItems()}
            user={user}
            onCartClick={() => setShowCart(true)}
            onLoginClick={() => setShowLogin(true)}
            onLogout={handleLogout}
          />
          
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Box>
                    <Box 
                      textAlign="center" 
                      py={8} 
                      mb={6}
                      sx={{
                        position: 'relative',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 4,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)',
                          zIndex: -1,
                        }
                      }}
                    >
                      <Typography 
                        variant="h1" 
                        component="h1" 
                        gutterBottom
                        sx={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 50%, #ec4899 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          fontWeight: 800,
                          fontSize: { xs: '2.5rem', md: '4rem' },
                          lineHeight: 1.1,
                          textShadow: '0 0 40px rgba(99, 102, 241, 0.3)',
                        }}
                      >
                        DevOpsify Store
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={{
                          background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          fontWeight: 600,
                          mb: 2,
                          fontSize: { xs: '1.25rem', md: '2rem' }
                        }}
                      >
                        GitOps Enabled Commerce
                      </Typography>
                      <Typography 
                        variant="h6" 
                        color="text.secondary"
                        sx={{
                          maxWidth: 600,
                          mx: 'auto',
                          opacity: 0.9,
                          fontWeight: 400,
                          lineHeight: 1.6
                        }}
                      >
                        Experience the future of e-commerce with cutting-edge technology and modern design
                      </Typography>
                    </Box>

                    <SimpleProductGrid
                      products={sampleProducts}
                      onAddToCart={addToCart}
                    />
                  </Box>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <Cart
                    items={cartItems}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromCart}
                    totalPrice={getTotalPrice()}
                  />
                } 
              />
              <Route 
                path="/login" 
                element={
                  <Login 
                    onLogin={handleLogin}
                    user={user}
                  />
                } 
              />
            </Routes>
          </Container>

          {showCart && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: 400,
                height: '100vh',
                bgcolor: 'background.paper',
                boxShadow: 3,
                zIndex: 1300,
                overflow: 'auto'
              }}
            >
              <Box p={2}>
                <Button 
                  onClick={() => setShowCart(false)}
                  sx={{ mb: 2 }}
                >
                  Close Cart
                </Button>
                <Cart
                  items={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                  totalPrice={getTotalPrice()}
                />
              </Box>
            </Box>
          )}

          {showCart && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                bgcolor: 'rgba(0,0,0,0.5)',
                zIndex: 1200
              }}
              onClick={() => setShowCart(false)}
            />
          )}

          {showLogin && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.5)',
                zIndex: 1300
              }}
              onClick={() => setShowLogin(false)}
            >
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  p: 3,
                  maxWidth: 500,
                  width: '90%',
                  maxHeight: '90vh',
                  overflow: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Login 
                  onLogin={handleLogin}
                  user={user}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
