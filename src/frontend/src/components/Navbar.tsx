import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Badge,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import {
  ShoppingCart,
  Store,
  Person,
  Logout,
} from '@mui/icons-material';

interface NavbarProps {
  cartItemCount: number;
  user: { id: string; email: string; name: string; token: string } | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartItemCount, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Store sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          DevOpsify Store
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Typography variant="body2">
                Welcome, {user.name}
              </Typography>
              <Button
                color="inherit"
                startIcon={<Logout />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              startIcon={<Person />}
            >
              Login
            </Button>
          )}

          <IconButton
            color="inherit"
            component={Link}
            to="/cart"
          >
            <Badge badgeContent={cartItemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
