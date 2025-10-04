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
    mode: 'light',
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#9C27B0',
    },
  },
});

const sampleProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'Electronics',
    stock: 50,
    rating: 4.8,
    reviews: 1247
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    description: 'Advanced fitness tracking with heart rate monitor',
    category: 'Electronics',
    stock: 30,
    rating: 4.6,
    reviews: 892
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
                    <Box textAlign="center" py={6} mb={4}>
                      <Typography 
                        variant="h2" 
                        component="h1" 
                        gutterBottom
                        sx={{
                          background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          fontWeight: 'bold'
                        }}
                      >
                        Welcome to DevOpsify
                      </Typography>
                      <Typography variant="h5" color="text.secondary">
                        Discover amazing products
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
