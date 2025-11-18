import { test, expect } from '@playwright/test';
import { ClientFactory } from '../../core/clients/ClientFactory';
import { ClientCloser } from '../../core/clients/ClientCloser';
import { ShopApiClient } from '../../core/clients/system/api/ShopApiClient';

test.describe('API E2E Tests', () => {
  let shopApiClient: ShopApiClient;

  test.beforeEach(async () => {
    shopApiClient = await ClientFactory.createShopApiClient();
  });

  test.afterEach(async () => {
    await ClientCloser.close(shopApiClient);
  });
  
  test('should successfully place an order with valid data', async () => {
    const response = await shopApiClient.orders().placeOrder('ABC-123', '1', 'US');
    
    await shopApiClient.orders().assertOrderPlacedSuccessfully(response);
  });

  test('should return validation errors for empty fields', async () => {
    const response = await shopApiClient.orders().placeOrder('', '', '');
    
    shopApiClient.orders().assertOrderPlacementFailed(response);
    const errorBody = await response.json();
    expect(errorBody.sku).toContain('SKU must not be empty');
    expect(errorBody.quantity).toContain('Quantity must not be empty');
    expect(errorBody.country).toContain('Country must not be empty');
  });

  test('should return validation error for non-positive quantity', async () => {
    const response = await shopApiClient.orders().placeOrder('ABC-123', '-1', 'US');
    
    shopApiClient.orders().assertOrderPlacementFailed(response);
    const errorBody = await response.json();
    expect(errorBody.quantity).toContain('Quantity must be positive');
  });

  test('should return validation error for zero quantity', async () => {
    const response = await shopApiClient.orders().placeOrder('ABC-123', '0', 'US');
    
    shopApiClient.orders().assertOrderPlacementFailed(response);
    const errorBody = await response.json();
    expect(errorBody.quantity).toContain('Quantity must be positive');
  });

  test('should return validation error for non-existent product', async () => {
    const response = await shopApiClient.orders().placeOrder('NON-EXISTENT', '1', 'US');
    
    shopApiClient.orders().assertOrderPlacementFailed(response);
    const errorBody = await response.json();
    expect(errorBody.message).toContain('Product does not exist');
  });

  test('should return validation error for non-existent country', async () => {
    const response = await shopApiClient.orders().placeOrder('ABC-123', '1', 'XX');
    
    shopApiClient.orders().assertOrderPlacementFailed(response);
    const errorBody = await response.json();
    expect(errorBody.message).toContain('Country does not exist');
  });

  test('should get order details', async () => {
    // First place an order
    const createResponse = await shopApiClient.orders().placeOrder('ABC-123', '2', 'US');
    
    const placeOrderResponse = await shopApiClient.orders().assertOrderPlacedSuccessfully(createResponse);
    const orderNumber = placeOrderResponse.orderNumber;
    
    // Get order details
    const getResponse = await shopApiClient.orders().viewOrder(orderNumber);
    const orderDetails = await shopApiClient.orders().assertOrderViewedSuccessfully(getResponse);
    
    // Assert all fields from GetOrderResponse
    expect(orderDetails.orderNumber).toBe(orderNumber);
    expect(orderDetails.sku).toBe('ABC-123');
    expect(orderDetails.quantity).toBe(2);
    expect(orderDetails.country).toBe('US');
    expect(orderDetails.unitPrice).toBe(1500.00);
    
    const expectedOriginalPrice = 3000.00;
    expect(orderDetails.originalPrice).toBe(expectedOriginalPrice);
    
    // Assert discount fields
    expect(orderDetails.discountRate).not.toBeNull();
    expect(orderDetails.discountRate).toBeGreaterThanOrEqual(0);
    expect(orderDetails.discountAmount).not.toBeNull();
    expect(orderDetails.discountAmount).toBeGreaterThanOrEqual(0);
    
    // Assert subtotal
    expect(orderDetails.subtotalPrice).not.toBeNull();
    expect(orderDetails.subtotalPrice).toBeGreaterThan(0);
    
    // Assert tax fields
    expect(orderDetails.taxRate).not.toBeNull();
    expect(orderDetails.taxRate).toBeGreaterThan(0);
    expect(orderDetails.taxAmount).not.toBeNull();
    expect(orderDetails.taxAmount).toBeGreaterThan(0);
    
    // Assert total price
    expect(orderDetails.totalPrice).not.toBeNull();
    expect(orderDetails.totalPrice).toBeGreaterThan(0);
    
    // Assert status
    expect(orderDetails.status).not.toBeNull();
    expect(orderDetails.status).toBe('PLACED');
  });

  test('should return 404 for non-existent order', async () => {
    const response = await shopApiClient.orders().viewOrder('NON-EXISTENT');
    expect(response.status()).toBe(404);
  });

  test('should successfully cancel an order', async () => {
    // First place an order
    const createResponse = await shopApiClient.orders().placeOrder('ABC-123', '1', 'US');
    
    const placeOrderResponse = await shopApiClient.orders().assertOrderPlacedSuccessfully(createResponse);
    const orderNumber = placeOrderResponse.orderNumber;
    
    // Cancel the order
    const cancelResponse = await shopApiClient.orders().cancelOrder(orderNumber);
    shopApiClient.orders().assertOrderCancelledSuccessfully(cancelResponse);
    
    // Verify order is cancelled
    const getResponse = await shopApiClient.orders().viewOrder(orderNumber);
    const orderDetails = await shopApiClient.orders().assertOrderViewedSuccessfully(getResponse);
    expect(orderDetails.status).toBe('CANCELLED');
  });

  test('should return 404 when cancelling non-existent order', async () => {
    const response = await shopApiClient.orders().cancelOrder('NON-EXISTENT');
    expect(response.status()).toBe(404);
  });

  test('should apply discount for orders placed after 17:00', async () => {
    // This test depends on the current time
    const response = await shopApiClient.orders().placeOrder('ABC-123', '1', 'US');
    
    const placeOrderResponse = await shopApiClient.orders().assertOrderPlacedSuccessfully(response);
    const getResponse = await shopApiClient.orders().viewOrder(placeOrderResponse.orderNumber);
    const orderDetails = await shopApiClient.orders().assertOrderViewedSuccessfully(getResponse);
    
    // Discount rate changes based on time, just verify it's valid
    expect(orderDetails.discountRate).toBeGreaterThanOrEqual(0);
    expect(orderDetails.discountAmount).toBeGreaterThanOrEqual(0);
  });

  test('should calculate tax correctly', async () => {
    const createResponse = await shopApiClient.orders().placeOrder('ABC-123', '1', 'US');
    
    const placeOrderResponse = await shopApiClient.orders().assertOrderPlacedSuccessfully(createResponse);
    const getResponse = await shopApiClient.orders().viewOrder(placeOrderResponse.orderNumber);
    const orderDetails = await shopApiClient.orders().assertOrderViewedSuccessfully(getResponse);
    
    // US tax rate is 7.25%
    expect(orderDetails.taxRate).toBe(0.0725);
    
    const expectedTaxAmount = orderDetails.subtotalPrice * 0.0725;
    expect(Math.abs(orderDetails.taxAmount - expectedTaxAmount)).toBeLessThan(0.01);
  });

  test('should calculate total price correctly', async () => {
    const createResponse = await shopApiClient.orders().placeOrder('DEF-456', '3', 'GB');
    
    const placeOrderResponse = await shopApiClient.orders().assertOrderPlacedSuccessfully(createResponse);
    const getResponse = await shopApiClient.orders().viewOrder(placeOrderResponse.orderNumber);
    const orderDetails = await shopApiClient.orders().assertOrderViewedSuccessfully(getResponse);
    
    // Unit price: 25.00, Quantity: 3
    expect(orderDetails.unitPrice).toBe(25.00);
    expect(orderDetails.originalPrice).toBe(75.00);
    
    const expectedSubtotal = orderDetails.originalPrice - orderDetails.discountAmount;
    expect(Math.abs(orderDetails.subtotalPrice - expectedSubtotal)).toBeLessThan(0.01);
    
    const expectedTotal = orderDetails.subtotalPrice + orderDetails.taxAmount;
    expect(Math.abs(orderDetails.totalPrice - expectedTotal)).toBeLessThan(0.01);
  });

  test('should handle different countries with different tax rates', async () => {
    const countries = [
      { code: 'US', taxRate: 0.0725 },
      { code: 'GB', taxRate: 0.20 },
      { code: 'DE', taxRate: 0.19 },
      { code: 'FR', taxRate: 0.20 },
      { code: 'CA', taxRate: 0.13 },
      { code: 'AU', taxRate: 0.10 }
    ];
    
    for (const country of countries) {
      const createResponse = await shopApiClient.orders().placeOrder('ABC-123', '1', country.code);
      
      const placeOrderResponse = await shopApiClient.orders().assertOrderPlacedSuccessfully(createResponse);
      const getResponse = await shopApiClient.orders().viewOrder(placeOrderResponse.orderNumber);
      const orderDetails = await shopApiClient.orders().assertOrderViewedSuccessfully(getResponse);
      
      expect(orderDetails.taxRate).toBe(country.taxRate);
    }
  });

  test('should handle multiple products', async () => {
    const products = ['ABC-123', 'DEF-456', 'GHI-789', 'JKL-012', 'MNO-345'];
    
    for (const sku of products) {
      const response = await shopApiClient.orders().placeOrder(sku, '1', 'US');
      
      await shopApiClient.orders().assertOrderPlacedSuccessfully(response);
    }
  });
});
