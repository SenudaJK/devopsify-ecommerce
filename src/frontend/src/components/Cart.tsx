import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Divider,
  Paper,
  TextField,
  Grid,
} from '@mui/material';
import {
  Remove,
  Add,
  Delete,
  ShoppingCartCheckout,
} from '@mui/icons-material';

interface CartItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  totalPrice: number;
}

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice,
}) => {
  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here!');
  };

  if (items.length === 0) {
    return (
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your cart is empty
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Add some products to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Cart ({items.length} items)
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <List>
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 2,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={item.image}
                        alt={item.name}
                        sx={{ width: 80, height: 80 }}
                        variant="rounded"
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primary={item.name}
                      secondary={item.description}
                      sx={{ ml: 2, flex: 1 }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Remove />
                      </IconButton>

                      <TextField
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          onUpdateQuantity(item.id, newQuantity);
                        }}
                        inputProps={{
                          min: 1,
                          max: item.stock,
                          style: { textAlign: 'center', width: '60px' }
                        }}
                        size="small"
                      />

                      <IconButton
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Add />
                      </IconButton>
                    </Box>

                    <Typography variant="h6" sx={{ ml: 2, minWidth: '80px' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>

                    <IconButton
                      onClick={() => onRemoveItem(item.id)}
                      color="error"
                      sx={{ ml: 1 }}
                    >
                      <Delete />
                    </IconButton>
                  </ListItem>
                  {index < items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              {items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Subtotal:</Typography>
              <Typography variant="body1">${totalPrice.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Shipping:</Typography>
              <Typography variant="body1">
                {totalPrice > 50 ? 'Free' : '$9.99'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Tax:</Typography>
              <Typography variant="body1">
                ${(totalPrice * 0.08).toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">
                ${(
                  totalPrice +
                  (totalPrice > 50 ? 0 : 9.99) +
                  totalPrice * 0.08
                ).toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ShoppingCartCheckout />}
              onClick={handleCheckout}
              sx={{ mb: 2 }}
            >
              Proceed to Checkout
            </Button>

            <Typography variant="body2" color="text.secondary" textAlign="center">
              Free shipping on orders over $50
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cart;
