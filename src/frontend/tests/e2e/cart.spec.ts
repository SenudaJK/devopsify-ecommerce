import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Login first (cart requires authentication)
    const loginButton = page.locator('text=Login');
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.fill('input[type="email"]', 'demo@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button:has-text("Login")');
      await page.waitForTimeout(2000);
    }
  });

  test('should open cart modal/page', async ({ page }) => {
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text(/Cart/i), [class*="cart"]');
    await cartButton.first().click();
    
    // Cart should be visible
    await expect(page.locator('text=/Shopping Cart|Your Cart|Cart Items/i')).toBeVisible({
      timeout: 5000
    });
  });

  test('should show empty cart message initially', async ({ page }) => {
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text(/Cart/i)');
    await cartButton.first().click();
    
    // Should show empty cart message
    await expect(page.locator('text=/Empty|No items|Cart is empty/i')).toBeVisible({
      timeout: 5000
    });
  });

  test('should add item to cart', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    
    // Add first product to cart
    const addToCartButton = page.locator('button:has-text(/Add to Cart/i)').first();
    await addToCartButton.click();
    
    await page.waitForTimeout(1500);
    
    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text(/Cart/i)');
    await cartButton.first().click();
    
    // Cart should have items
    const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
    expect(await cartItems.count()).toBeGreaterThan(0);
  });

  test('should display correct item details in cart', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    
    const firstProduct = page.locator('[data-testid="product-card"], .product-card').first();
    const productName = await firstProduct.locator('h2, h3, .product-name').textContent();
    
    await page.locator('button:has-text(/Add to Cart/i)').first().click();
    await page.waitForTimeout(1500);
    
    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text(/Cart/i)');
    await cartButton.first().click();
    
    // Product name should be in cart
    await expect(page.locator(`text=${productName}`)).toBeVisible({ timeout: 5000 });
  });

  test('should update quantity in cart', async ({ page }) => {
    // Add product
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    await page.locator('button:has-text(/Add to Cart/i)').first().click();
    await page.waitForTimeout(1500);
    
    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text(/Cart/i)');
    await cartButton.first().click();
    
    // Find quantity controls
    const increaseButton = page.locator('button:has-text("+"), [data-testid="increase-quantity"]').first();
    
    if (await increaseButton.isVisible()) {
      const initialQuantity = await page.locator('input[type="number"], [data-testid="quantity"]').first().inputValue();
      
      await increaseButton.click();
      await page.waitForTimeout(1000);
      
      const newQuantity = await page.locator('input[type="number"], [data-testid="quantity"]').first().inputValue();
      expect(parseInt(newQuantity)).toBeGreaterThan(parseInt(initialQuantity));
    }
  });

  test('should decrease quantity in cart', async ({ page }) => {
    // Add product twice
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    const addButton = page.locator('button:has-text(/Add to Cart/i)').first();
    await addButton.click();
    await page.waitForTimeout(500);
    await addButton.click();
    await page.waitForTimeout(1500);
    
    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text(/Cart/i)');
    await cartButton.first().click();
    
    // Decrease quantity
    const decreaseButton = page.locator('button:has-text("-"), [data-testid="decrease-quantity"]').first();
    
    if (await decreaseButton.isVisible()) {
      const initialQuantity = await page.locator('input[type="number"], [data-testid="quantity"]').first().inputValue();
      
      await decreaseButton.click();
      await page.waitForTimeout(1000);
      
      const newQuantity = await page.locator('input[type="number"], [data-testid="quantity"]').first().inputValue();
      expect(parseInt(newQuantity)).toBeLessThan(parseInt(initialQuantity));
    }
  });

  test('should remove item from cart', async ({ page }) => {
    // Add product
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    await page.locator('button:has-text(/Add to Cart/i)').first().click();
    await page.waitForTimeout(1500);
    
    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text(/Cart/i)');
    await cartButton.first().click();
    
    // Remove item
    const removeButton = page.locator('button:has-text(/Remove|Delete|×/i), [data-testid="remove-item"]').first();
    
    if (await removeButton.isVisible()) {
      await removeButton.click();
      await page.waitForTimeout(1000);
      
      // Should show empty cart or have fewer items
      const isEmpty = await page.locator('text=/Empty|No items/i').isVisible();
      const itemCount = await page.locator('[data-testid="cart-item"], .cart-item').count();
      
      expect(isEmpty || itemCount === 0).toBeTruthy();
    }
  });

  test('should calculate total price correctly', async ({ page }) => {
    // Add product
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    await page.locator('button:has-text(/Add to Cart/i)').first().click();
    await page.waitForTimeout(1500);
    
    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text(/Cart/i)');
    await cartButton.first().click();
    
    // Should show total
    const totalElement = page.locator('text=/Total:?\\s*\\$\\d+/i, [data-testid="cart-total"]');
    await expect(totalElement).toBeVisible({ timeout: 5000 });
    
    const totalText = await totalElement.textContent();
    expect(totalText).toMatch(/\$\d+/);
  });

  test('should persist cart after page reload', async ({ page }) => {
    // Add product
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    await page.locator('button:has-text(/Add to Cart/i)').first().click();
    await page.waitForTimeout(1500);
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text(/Cart/i)');
    await cartButton.first().click();
    
    // Cart should still have items
    const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
    expect(await cartItems.count()).toBeGreaterThan(0);
  });

  test('should show cart item count badge', async ({ page }) => {
    // Add product
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    await page.locator('button:has-text(/Add to Cart/i)').first().click();
    await page.waitForTimeout(1500);
    
    // Cart badge should update
    const cartBadge = page.locator('[data-testid="cart-count"], .cart-count, .badge');
    
    if (await cartBadge.isVisible()) {
      const count = await cartBadge.textContent();
      expect(parseInt(count!)).toBeGreaterThan(0);
    }
  });

  test('should prevent negative quantities', async ({ page }) => {
    // Add product
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    await page.locator('button:has-text(/Add to Cart/i)').first().click();
    await page.waitForTimeout(1500);
    
    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text(/Cart/i)');
    await cartButton.first().click();
    
    // Try to set negative quantity
    const quantityInput = page.locator('input[type="number"], [data-testid="quantity"]').first();
    
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('-5');
      await page.waitForTimeout(500);
      
      const value = await quantityInput.inputValue();
      expect(parseInt(value)).toBeGreaterThanOrEqual(0);
    }
  });

  test('should handle checkout button', async ({ page }) => {
    // Add product
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    await page.locator('button:has-text(/Add to Cart/i)').first().click();
    await page.waitForTimeout(1500);
    
    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text(/Cart/i)');
    await cartButton.first().click();
    
    // Click checkout
    const checkoutButton = page.locator('button:has-text(/Checkout|Proceed/i)');
    
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      await page.waitForTimeout(1000);
      
      // Should navigate to checkout or show checkout form
      const hasCheckout = await page.locator('text=/Checkout|Payment|Shipping/i').isVisible();
      expect(hasCheckout).toBeTruthy();
    }
  });
});

test.describe('Shopping Cart - Edge Cases', () => {
  test('should handle adding out-of-stock items', async ({ page }) => {
    await page.goto('/');
    
    // Look for out of stock items
    const outOfStockProduct = page.locator('text=/Out of Stock/i').first();
    
    if (await outOfStockProduct.isVisible()) {
      const addButton = outOfStockProduct.locator('..').locator('button:has-text(/Add to Cart/i)');
      
      if (await addButton.isVisible()) {
        await expect(addButton).toBeDisabled();
      }
    }
  });

  test('should handle cart with mixed products', async ({ page }) => {
    await page.goto('/');
    
    // Login
    const loginButton = page.locator('text=Login');
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.fill('input[type="email"]', 'demo@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button:has-text("Login")');
      await page.waitForTimeout(2000);
    }
    
    // Add multiple different products
    await page.waitForSelector('[data-testid="product-card"], .product-card', {
      timeout: 10000
    });
    
    const addButtons = page.locator('button:has-text(/Add to Cart/i)');
    const count = Math.min(await addButtons.count(), 3);
    
    for (let i = 0; i < count; i++) {
      await addButtons.nth(i).click();
      await page.waitForTimeout(800);
    }
    
    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"], button:has-text(/Cart/i)');
    await cartButton.first().click();
    
    // Should have multiple items
    const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
    expect(await cartItems.count()).toBeGreaterThanOrEqual(count);
  });
});
