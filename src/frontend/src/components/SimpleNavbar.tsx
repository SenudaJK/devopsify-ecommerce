import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge,
  Button,
  Box
} from '@mui/material';
import { ShoppingCart, AccountCircle } from '@mui/icons-material';

interface SimpleNavbarProps {
  cartItemsCount: number;
  user: any | null;
  onCartClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
}

const SimpleNavbar: React.FC<SimpleNavbarProps> = ({
  cartItemsCount,
  user,
  onCartClick,
  onLoginClick,
  onLogout
}) => {
  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          DevOpsify Store
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={onCartClick}>
            <Badge badgeContent={cartItemsCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountCircle />
              <Typography variant="body2">{user.name}</Typography>
              <Button color="inherit" onClick={onLogout} size="small">
                Logout
              </Button>
            </Box>
          ) : (
            <Button color="inherit" onClick={onLoginClick}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SimpleNavbar;