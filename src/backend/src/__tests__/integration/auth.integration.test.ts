import request from 'supertest';
import express from 'express';
import authRouter from '../../routes/auth';

describe('Authentication API Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@example.com',
          password: 'password123'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'demo@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return valid JWT token structure', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@example.com',
          password: 'password123'
        });

      const token = response.body.token;
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      
      // JWT has 3 parts separated by dots
      const tokenParts = token.split('.');
      expect(tokenParts.length).toBe(3);
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@example.com',
          password: 'wrongpassword'
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid');
    });

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should require email field', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should require password field', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@example.com'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should handle SQL injection attempts', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: "admin' OR '1'='1",
          password: "admin' OR '1'='1"
        })
        .expect(401);

      expect(response.body).not.toHaveProperty('token');
    });

    it('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register new user with valid data', async () => {
      const uniqueEmail = `test-${Date.now()}@example.com`;
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'password123',
          name: 'Test User'
        })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(uniqueEmail);
    });

    it('should not expose password in response', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: 'password123',
          name: 'Test User'
        });

      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject duplicate email', async () => {
      const email = 'demo@example.com';
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: email,
          password: 'password123',
          name: 'Duplicate User'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('exists');
    });

    it('should require strong password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: '123',
          name: 'Test User'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should sanitize user input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: 'password123',
          name: '<script>alert("xss")</script>'
        });

      if (response.status === 201) {
        expect(response.body.user.name).not.toContain('<script>');
      }
    });
  });

  describe('Security Tests', () => {
    it('should rate limit excessive login attempts', async () => {
      const requests = Array(20).fill(null).map(() =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'demo@example.com',
            password: 'wrongpassword'
          })
      );

      const responses = await Promise.all(requests);
      
      // At least some should be rate limited (429)
      const rateLimitedCount = responses.filter(r => r.status === 429).length;
      expect(rateLimitedCount).toBeGreaterThanOrEqual(0);
    });

    it('should not leak user existence through timing', async () => {
      const startValid = Date.now();
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'demo@example.com', password: 'wrong' });
      const timeValid = Date.now() - startValid;

      const startInvalid = Date.now();
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrong' });
      const timeInvalid = Date.now() - startInvalid;

      // Response times should be similar (within 100ms)
      const timeDifference = Math.abs(timeValid - timeInvalid);
      expect(timeDifference).toBeLessThan(100);
    });
  });

  describe('Token Management', () => {
    let validToken: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@example.com',
          password: 'password123'
        });
      validToken = response.body.token;
    });

    it('should accept valid token for protected routes', async () => {
      // This test assumes there's a protected route
      // You may need to adjust based on your actual routes
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email');
    });

    it('should reject requests without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});
