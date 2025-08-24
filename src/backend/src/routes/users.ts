import express from 'express';

const router = express.Router();

// GET /api/users/profile - Mock user profile endpoint
router.get('/profile', async (req, res) => {
  res.json({
    success: true,
    data: {
      id: '1',
      email: 'demo@devopsify.com',
      name: 'Demo User',
      role: 'user',
    },
  });
});

export default router;
