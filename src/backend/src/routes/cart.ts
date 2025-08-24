import express from 'express';

const router = express.Router();

// GET /api/cart - Mock cart endpoint
router.get('/', async (req, res) => {
  res.json({
    success: true,
    data: {
      items: [],
      total: 0,
    },
  });
});

export default router;
