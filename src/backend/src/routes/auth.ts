import express from 'express';
import User from '../models/User';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // For demo purposes, return mock user
    if (email === 'demo@devopsify.com' && password === 'demo123') {
      return res.json({
        success: true,
        data: {
          user: {
            id: '1',
            email: 'demo@devopsify.com',
            name: 'Demo User',
            role: 'user',
          },
          token: 'mock-jwt-token',
        },
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
});

export default router;
