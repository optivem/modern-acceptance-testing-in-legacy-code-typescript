import { test, expect } from '@playwright/test';

test.describe('UI E2E Tests', () => {
  
  test('should successfully place an order with valid data', async ({ page }) => {
    await page.goto('/shop.html');
    
    await page.fill('#sku', 'ABC-123');
    await page.fill('#quantity', '2');
    await page.fill('#country', 'US');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#message .success')).toContainText('Order placed successfully');
    await expect(page.locator('#message .success')).toContainText('ORD-');
  });

  test('should show validation error for empty SKU', async ({ page }) => {
    await page.goto('/shop.html');
    
    await page.fill('#sku', '');
    await page.fill('#quantity', '1');
    await page.fill('#country', 'US');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#skuError')).toContainText('SKU must not be empty');
  });

  test('should show validation error for empty quantity', async ({ page }) => {
    await page.goto('/shop.html');
    
    await page.fill('#sku', 'ABC-123');
    await page.fill('#quantity', '');
    await page.fill('#country', 'US');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#quantityError')).toContainText('Quantity must not be empty');
  });

  test('should show validation error for non-positive quantity', async ({ page }) => {
    await page.goto('/shop.html');
    
    await page.fill('#sku', 'ABC-123');
    await page.fill('#quantity', '-1');
    await page.fill('#country', 'US');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#quantityError')).toContainText('Quantity must be positive');
  });

  test('should show validation error for empty country', async ({ page }) => {
    await page.goto('/shop.html');
    
    await page.fill('#sku', 'ABC-123');
    await page.fill('#quantity', '1');
    await page.fill('#country', '');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#countryError')).toContainText('Country must not be empty');
  });

  test('should show error for non-existent product SKU', async ({ page }) => {
    await page.goto('/shop.html');
    
    await page.fill('#sku', 'NON-EXISTENT');
    await page.fill('#quantity', '1');
    await page.fill('#country', 'US');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#message .error')).toContainText('Product does not exist');
  });

  test('should show error for non-existent country', async ({ page }) => {
    await page.goto('/shop.html');
    
    await page.fill('#sku', 'ABC-123');
    await page.fill('#quantity', '1');
    await page.fill('#country', 'XX');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#message .error')).toContainText('Country does not exist');
  });

  test('should display order details', async ({ page }) => {
    // First place an order
    await page.goto('/shop.html');
    await page.fill('#sku', 'ABC-123');
    await page.fill('#quantity', '1');
    await page.fill('#country', 'US');
    await page.click('button[type="submit"]');
    
    // Extract order number
    const messageText = await page.locator('#message .success').textContent();
    const orderNumber = messageText?.match(/ORD-[a-f0-9-]+/)?.[0];
    
    expect(orderNumber).toBeTruthy();
    
    // Navigate to order history
    await page.goto('/order-history.html');
    await page.fill('#orderNumber', orderNumber!);
    await page.click('button[type="submit"]');
    
    // Verify order details
    await expect(page.locator('#detailOrderNumber')).toContainText(orderNumber!);
    await expect(page.locator('#detailSku')).toContainText('ABC-123');
    await expect(page.locator('#detailQuantity')).toContainText('1');
    await expect(page.locator('#detailCountry')).toContainText('US');
    await expect(page.locator('#detailUnitPrice')).toContainText('$1500.00');
    await expect(page.locator('#detailOriginalPrice')).toContainText('$1500.00');
    
    // Verify discount fields are present and formatted
    const discountRate = await page.locator('#displayDiscountRate').inputValue();
    expect(discountRate).toMatch(/%$/);
    const discountAmount = await page.locator('#displayDiscountAmount').inputValue();
    expect(discountAmount).toMatch(/^\$/);
    
    // Verify subtotal is present and formatted
    const subtotalPrice = await page.locator('#displaySubtotalPrice').inputValue();
    expect(subtotalPrice).toMatch(/^\$/);
    expect(parseFloat(subtotalPrice.replace('$', ''))).toBeGreaterThan(0);
    
    // Verify tax fields are present and formatted
    const taxRate = await page.locator('#displayTaxRate').inputValue();
    expect(taxRate).toMatch(/%$/);
    const taxAmount = await page.locator('#displayTaxAmount').inputValue();
    expect(taxAmount).toMatch(/^\$/);
    expect(parseFloat(taxAmount.replace('$', ''))).toBeGreaterThan(0);
    
    // Verify total price is present and formatted
    const totalPrice = await page.locator('#displayTotalPrice').inputValue();
    expect(totalPrice).toMatch(/^\$/);
    expect(parseFloat(totalPrice.replace('$', ''))).toBeGreaterThan(0);
    
    // Verify status
    await expect(page.locator('#detailStatus .status')).toContainText('PLACED');
  });

  test('should successfully cancel an order', async ({ page }) => {
    // First place an order
    await page.goto('/shop.html');
    await page.fill('#sku', 'ABC-123');
    await page.fill('#quantity', '1');
    await page.fill('#country', 'US');
    await page.click('button[type="submit"]');
    
    const messageText = await page.locator('#message .success').textContent();
    const orderNumber = messageText?.match(/ORD-[a-f0-9-]+/)?.[0];
    
    // Navigate to order history
    await page.goto('/order-history.html');
    await page.fill('#orderNumber', orderNumber!);
    await page.click('button[type="submit"]');
    
    // Cancel the order
    page.on('dialog', dialog => dialog.accept());
    await page.click('#cancelButton');
    
    // Verify cancellation
    await expect(page.locator('#message .success')).toContainText('Order cancelled successfully');
    await expect(page.locator('#detailStatus .status')).toContainText('CANCELLED');
  });

  test('should show not found for non-existent order', async ({ page }) => {
    await page.goto('/order-history.html');
    await page.fill('#orderNumber', 'NON-EXISTENT-ORDER');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#message .error')).toContainText('Order not found');
  });
});
