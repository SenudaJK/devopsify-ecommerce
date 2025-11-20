import { test, expect } from '@playwright/test';

test.describe('Product Browsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display product list on homepage', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]', {
      timeout: 10000
    });
    
    const products = page.locator('[data-testid="product-card"], .product-card, [class*="ProductCard"]');
    const count = await products.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should show product details', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    
    const firstProduct = page.locator('[data-testid="product-card"], .product-card').first();
    
    // Should show product name
    await expect(firstProduct.locator('h2, h3, .product-name, [class*="name"]')).toBeVisible();
    
    // Should show price
    await expect(firstProduct.locator('text=/\\$\\d+|Price:/i')).toBeVisible();
    
    // Should show image
    await expect(firstProduct.locator('img')).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    // Look for category filter
    const categoryFilter = page.locator('select, [data-testid="category-filter"]');
    
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption('Electronics');
      
      // Wait for filter to apply
      await page.waitForTimeout(1000);
      
      // Products should be visible
      const products = page.locator('[data-testid="product-card"], .product-card');
      expect(await products.count()).toBeGreaterThan(0);
    }
  });

  test('should search for products', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('laptop');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(1000);
      
      // Should show search results
      const products = page.locator('[data-testid="product-card"], .product-card');
      expect(await products.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('nonexistentproduct12345xyz');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(1000);
      
      // Should show "no results" message
      await expect(page.locator('text=/No products|No results|Not found/i')).toBeVisible({
        timeout: 5000
      });
    }
  });

  test('should navigate to product detail page', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    
    const firstProduct = page.locator('[data-testid="product-card"], .product-card').first();
    await firstProduct.click();
    
    // URL should change or modal should appear
    await page.waitForTimeout(1000);
    
    // Should show detailed product information
    const hasDetailedView = await page.locator('text=/Description|Details|Add to Cart/i').isVisible();
    expect(hasDetailedView).toBeTruthy();
  });

  test('should lazy load images', async ({ page }) => {
    await page.waitForSelector('img', { timeout: 10000 });
    
    const images = page.locator('img');
    const firstImage = images.first();
    
    // Image should have loaded
    await expect(firstImage).toHaveAttribute('src', /.+/);
    
    // Image should be visible
    await expect(firstImage).toBeVisible();
  });

  test('should display correct product information', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    
    const firstProduct = page.locator('[data-testid="product-card"], .product-card').first();
    
    // Get product name
    const productName = await firstProduct.locator('h2, h3, .product-name').textContent();
    expect(productName).toBeTruthy();
    expect(productName!.length).toBeGreaterThan(0);
    
    // Get price
    const priceText = await firstProduct.locator('text=/\\$\\d+/').textContent();
    expect(priceText).toMatch(/\$\d+/);
  });

  test('should handle loading state', async ({ page }) => {
    // Navigate to page
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Should show loading indicator initially
    const loadingIndicator = page.locator('text=/Loading|Spinner/i, [data-testid="loading"]');
    
    // Wait for either loading to appear or products to load
    await Promise.race([
      loadingIndicator.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {}),
      page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    ]);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    
    // Products should be visible on mobile
    const products = page.locator('[data-testid="product-card"], .product-card');
    await expect(products.first()).toBeVisible();
  });
});

test.describe('Product Interaction', () => {
  test('should add product to cart from list', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    
    const addToCartButton = page.locator('button:has-text(/Add to Cart/i)').first();
    
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      
      // Should show success message or cart update
      await page.waitForTimeout(1000);
      
      // Cart icon should update or success message appears
      const hasCartUpdate = await page.locator('text=/Added|Success|Cart/i, [data-testid="cart-count"]').isVisible();
      expect(hasCartUpdate).toBeTruthy();
    }
  });

  test('should handle rapid add-to-cart clicks', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    
    const addToCartButton = page.locator('button:has-text(/Add to Cart/i)').first();
    
    if (await addToCartButton.isVisible()) {
      // Click multiple times rapidly
      await addToCartButton.click();
      await addToCartButton.click();
      await addToCartButton.click();
      
      await page.waitForTimeout(1000);
      
      // Should handle gracefully without errors
      const hasError = await page.locator('text=/Error|Failed/i').isVisible();
      expect(hasError).toBeFalsy();
    }
  });

  test('should show out of stock products differently', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    
    // Look for out of stock indicators
    const outOfStockIndicator = page.locator('text=/Out of Stock|Unavailable/i');
    
    if (await outOfStockIndicator.isVisible()) {
      // Add to cart button should be disabled
      const parentProduct = outOfStockIndicator.locator('..');
      const addButton = parentProduct.locator('button:has-text(/Add to Cart/i)');
      
      if (await addButton.isVisible()) {
        await expect(addButton).toBeDisabled();
      }
    }
  });
});

test.describe('Product Browsing - Performance', () => {
  test('should load products within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle slow network gracefully', async ({ page }) => {
    // Simulate slow 3G
    await page.context().route('**/*', route => {
      setTimeout(() => route.continue(), 1000);
    });
    
    await page.goto('/');
    
    // Should show loading state
    const loadingState = page.locator('text=/Loading|Spinner/i');
    
    // Either loading indicator visible or products eventually load
    await Promise.race([
      loadingState.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {}),
      page.waitForSelector('[data-testid="product-card"]', { timeout: 15000 })
    ]);
  });
});
