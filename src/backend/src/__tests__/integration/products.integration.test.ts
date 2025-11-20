import request from 'supertest';
import express from 'express';
import productsRouter from '../../routes/products';

describe('Products API Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/products', productsRouter);
  });

  describe('GET /api/products', () => {
    it('should return all products with 200 status', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return products with correct structure', async () => {
      const response = await request(app).get('/api/products');

      const product = response.body[0];
      expect(product).toHaveProperty('_id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('image');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('stock');
    });

    it('should return products with valid data types', async () => {
      const response = await request(app).get('/api/products');

      const product = response.body[0];
      expect(typeof product._id).toBe('string');
      expect(typeof product.name).toBe('string');
      expect(typeof product.price).toBe('number');
      expect(typeof product.description).toBe('string');
      expect(typeof product.stock).toBe('number');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a specific product by ID', async () => {
      const allProducts = await request(app).get('/api/products');
      const productId = allProducts.body[0]._id;

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('_id', productId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/nonexistent-id')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('not found');
    });

    it('should handle special characters in product ID', async () => {
      const response = await request(app)
        .get('/api/products/invalid@id#123')
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Product Data Integrity', () => {
    it('should have unique product IDs', async () => {
      const response = await request(app).get('/api/products');
      const productIds = response.body.map((p: any) => p._id);
      const uniqueIds = new Set(productIds);

      expect(uniqueIds.size).toBe(productIds.length);
    });

    it('should have positive prices for all products', async () => {
      const response = await request(app).get('/api/products');

      response.body.forEach((product: any) => {
        expect(product.price).toBeGreaterThan(0);
      });
    });

    it('should have non-negative stock values', async () => {
      const response = await request(app).get('/api/products');

      response.body.forEach((product: any) => {
        expect(product.stock).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have valid category values', async () => {
      const response = await request(app).get('/api/products');
      const validCategories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

      response.body.forEach((product: any) => {
        expect(validCategories).toContain(product.category);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      // This would require mocking the data source to throw an error
      // For now, test that error responses have correct format
      const response = await request(app).get('/api/products/test-error-handling');

      if (response.status >= 400) {
        expect(response.body).toHaveProperty('message');
      }
    });
  });

  describe('Performance Tests', () => {
    it('should respond within acceptable time (< 1000ms)', async () => {
      const startTime = Date.now();
      
      await request(app).get('/api/products').expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(1000);
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        request(app).get('/api/products')
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
      });
    });
  });
});
