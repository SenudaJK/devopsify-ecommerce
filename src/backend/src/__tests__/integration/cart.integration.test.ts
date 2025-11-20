import request from 'supertest';
import express from 'express';
import cartRouter from '../../routes/cart';

describe('Cart API Integration Tests', () => {
  let app: express.Application;
  let authToken: string;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/cart', cartRouter);
    
    // Mock auth token for testing
    authToken = 'mock-jwt-token-for-testing';
  });

  describe('GET /api/cart', () => {
    it('should return empty cart for new user', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body.items).toBeInstanceOf(Array);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/cart/items', () => {
    it('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: 'product-1',
          quantity: 2
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body.items.length).toBeGreaterThan(0);
    });

    it('should validate product ID', async () => {
      const response = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 2
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should validate quantity', async () => {
      const response = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: 'product-1',
          quantity: -1
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject zero quantity', async () => {
      const response = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: 'product-1',
          quantity: 0
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should handle excessive quantities', async () => {
      const response = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: 'product-1',
          quantity: 99999
        });

      // Should either accept with stock validation or reject
      expect([200, 400]).toContain(response.status);
    });
  });

  describe('PUT /api/cart/items/:productId', () => {
    beforeEach(async () => {
      // Add item to cart first
      await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: 'product-1',
          quantity: 1
        });
    });

    it('should update item quantity', async () => {
      const response = await request(app)
        .put('/api/cart/items/product-1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 5
        })
        .expect('Content-Type', /json/)
        .expect(200);

      const updatedItem = response.body.items.find((item: any) => item.productId === 'product-1');
      expect(updatedItem.quantity).toBe(5);
    });

    it('should reject invalid quantity update', async () => {
      const response = await request(app)
        .put('/api/cart/items/product-1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: -5
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .put('/api/cart/items/non-existent-product')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 1
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/cart/items/:productId', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: 'product-to-delete',
          quantity: 1
        });
    });

    it('should remove item from cart', async () => {
      const response = await request(app)
        .delete('/api/cart/items/product-to-delete')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedItem = response.body.items.find((item: any) => item.productId === 'product-to-delete');
      expect(deletedItem).toBeUndefined();
    });

    it('should handle deleting non-existent item gracefully', async () => {
      const response = await request(app)
        .delete('/api/cart/items/non-existent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('items');
    });
  });

  describe('DELETE /api/cart', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: 'product-1',
          quantity: 1
        });
    });

    it('should clear entire cart', async () => {
      const response = await request(app)
        .delete('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.items).toHaveLength(0);
    });
  });

  describe('Cart Business Logic', () => {
    it('should calculate correct cart total', async () => {
      await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: 'product-1', quantity: 2 });

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.body).toHaveProperty('total');
      expect(typeof response.body.total).toBe('number');
      expect(response.body.total).toBeGreaterThan(0);
    });

    it('should merge duplicate product additions', async () => {
      await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: 'product-merge', quantity: 2 });

      await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: 'product-merge', quantity: 3 });

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`);

      const item = response.body.items.find((i: any) => i.productId === 'product-merge');
      expect(item.quantity).toBe(5);
    });
  });

  describe('Performance Tests', () => {
    it('should handle rapid cart updates', async () => {
      const requests = Array(10).fill(null).map((_, i) =>
        request(app)
          .post('/api/cart/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            productId: `product-${i}`,
            quantity: 1
          })
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect([200, 400]).toContain(response.status);
      });
    });
  });
});
