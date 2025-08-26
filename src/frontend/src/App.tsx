import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Badge,
  IconButton,
  Box,
} from '@mui/material';
import {
  ShoppingCart,
  Store,
  Person,
} from '@mui/icons-material';

// Components
import ProductList from './components/ProductList.tsx';
import Cart from './components/Cart.tsx';
import Login from './components/Login.tsx';
import Navbar from './components/Navbar.tsx';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar 
        cartItemCount={getTotalItems()}
        user={user}
        onLogout={() => setUser(null)}
      />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProductList 
                onAddToCart={addToCart}
                user={user}
              />
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
                onLogin={setUser}
                user={user}
              />
            } 
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
