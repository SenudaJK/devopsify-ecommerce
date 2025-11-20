import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form', async ({ page }) => {
    await page.click('text=Login');
    
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.click('text=Login');
    
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Login")');
    
    // Wait for successful login
    await page.waitForURL(/.*/, { waitUntil: 'networkidle' });
    
    // Should show user menu or welcome message
    await expect(page.locator('text=/Welcome|Logout|Account/i')).toBeVisible({
      timeout: 5000
    });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.click('text=Login');
    
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Login")');
    
    // Should display error message
    await expect(page.locator('text=/Invalid|Error|Failed/i')).toBeVisible({
      timeout: 5000
    });
  });

  test('should validate email format', async ({ page }) => {
    await page.click('text=Login');
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Login")');
    
    // Should show validation error
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.click('text=Login');
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Login")');
    
    await page.waitForTimeout(2000);
    
    // Logout
    await page.click('text=/Logout|Sign Out/i');
    
    // Should be redirected to home or see login button
    await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
  });

  test('should persist session after page reload', async ({ page }) => {
    // Login
    await page.click('text=Login');
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Login")');
    
    await page.waitForTimeout(2000);
    
    // Reload page
    await page.reload();
    
    // Should still be logged in
    await expect(page.locator('text=/Welcome|Logout|Account/i')).toBeVisible({
      timeout: 5000
    });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);
    
    await page.click('text=Login');
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Login")');
    
    // Should show network error
    await expect(page.locator('text=/Network|Connection|Error/i')).toBeVisible({
      timeout: 5000
    });
    
    // Restore online mode
    await page.context().setOffline(false);
  });

  test('should not expose password in HTML', async ({ page }) => {
    await page.click('text=Login');
    
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    
    // Password field should have type="password"
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should clear form on cancel', async ({ page }) => {
    await page.click('text=Login');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'test123');
    
    // Try to close modal/form
    const cancelButton = page.locator('button:has-text(/Cancel|Close/i)');
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
    } else {
      await page.keyboard.press('Escape');
    }
    
    // Open again and check if fields are cleared
    await page.click('text=Login');
    await expect(page.locator('input[type="email"]')).toHaveValue('');
  });
});

test.describe('Authentication - Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab to login button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Should open login form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Tab through form fields
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON']).toContain(focusedElement);
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Login');
    
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Check for labels or aria-label
    await expect(emailInput).toHaveAttribute('aria-label', /.+/);
    await expect(passwordInput).toHaveAttribute('aria-label', /.+/);
  });
});
