describe('Utility Functions', () => {
  it('should validate email format', () => {
    const validEmails = [
      'test@devopsify.com',
      'user@example.org',
      'admin@shop.io'
    ];
    
    const invalidEmails = [
      'invalid-email',
      '@invalid.com',
      'test@',
      'test.com'
    ];
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    validEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(true);
    });
    
    invalidEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });

  it('should handle CORS configuration', () => {
    const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
    
    expect(corsOrigin).toMatch(/^https?:\/\//);
  });

  it('should validate API response structure', () => {
    const mockApiResponse = {
      success: true,
      data: { id: 1, name: 'Test Product' },
      message: 'Product retrieved successfully'
    };

    expect(mockApiResponse).toHaveProperty('success');
    expect(mockApiResponse).toHaveProperty('data');
    expect(mockApiResponse).toHaveProperty('message');
    expect(typeof mockApiResponse.success).toBe('boolean');
  });
});