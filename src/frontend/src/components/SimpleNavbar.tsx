import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge,
  Button,
  Box,
  Avatar
} from '@mui/material';
import { 
  ShoppingCart, 
  Store, 
  Search,
  Notifications
} from '@mui/icons-material';

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
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Store sx={{ color: '#6366f1', fontSize: 32 }} />
          <Typography 
            variant="h5" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.025em'
            }}
          >
            DevOpsify
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            color="inherit" 
            sx={{ 
              color: 'text.secondary',
              '&:hover': { 
                color: 'primary.main',
                background: 'rgba(99, 102, 241, 0.1)'
              }
            }}
          >
            <Search />
          </IconButton>
          
          <IconButton 
            color="inherit"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { 
                color: 'secondary.main',
                background: 'rgba(245, 158, 11, 0.1)'
              }
            }}
          >
            <Notifications />
          </IconButton>
          
          <IconButton 
            color="inherit" 
            onClick={onCartClick}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { 
                color: 'primary.main',
                background: 'rgba(99, 102, 241, 0.1)'
              }
            }}
          >
            <Badge 
              badgeContent={cartItemsCount} 
              color="secondary"
              sx={{
                '& .MuiBadge-badge': {
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
                  color: 'white',
                  fontWeight: 600
                }
              }}
            >
              <ShoppingCart />
            </Badge>
          </IconButton>
          
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {user.name?.charAt(0) || 'U'}
              </Avatar>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                {user.name}
              </Typography>
              <Button 
                color="inherit" 
                onClick={onLogout} 
                size="small"
                sx={{ 
                  ml: 1,
                  color: 'text.secondary',
                  borderRadius: 2,
                  '&:hover': { 
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'text.primary'
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Button 
              color="inherit" 
              onClick={onLoginClick}
              variant="outlined"
              sx={{ 
                borderColor: 'rgba(99, 102, 241, 0.5)',
                color: 'primary.main',
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': { 
                  borderColor: 'primary.main',
                  background: 'rgba(99, 102, 241, 0.1)'
                }
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SimpleNavbar;