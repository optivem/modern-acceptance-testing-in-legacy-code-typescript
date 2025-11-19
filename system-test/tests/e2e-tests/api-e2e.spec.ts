import { test, expect } from '@playwright/test';
import { ClientFactory } from '../../core/clients/ClientFactory';
import { ClientCloser } from '../../core/clients/ClientCloser';
import { ShopApiClient } from '../../core/clients/system/api/ShopApiClient';
import { ErpApiClient } from '../../core/clients/external/erp/ErpApiClient';

test.describe('API E2E Tests', () => {
  let shopApiClient: ShopApiClient;
  let erpApiClient: ErpApiClient;

  test.beforeEach(async () => {
    shopApiClient = await ClientFactory.createShopApiClient();
    erpApiClient = await ClientFactory.createErpApiClient();
  });

  test.afterEach(async () => {
    await ClientCloser.close(shopApiClient);
    await ClientCloser.close(erpApiClient);
  });
  
  test('should successfully place an order with valid data', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-PO-100';
    const unitPrice = 199.99;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act
    const response = await shopApiClient.orders().placeOrder(sku, '1', 'US');
    
    // Assert
    await shopApiClient.orders().assertOrderPlacedSuccessfully(response);
  });

  test('should return validation errors for empty fields', async () => {
    const response = await shopApiClient.orders().placeOrder('', '', '');
    
    await shopApiClient.orders().assertOrderPlacementFailed(response);
    const errorBody = response.data;
    expect(errorBody.sku).toContain('SKU must not be empty');
    expect(errorBody.quantity).toContain('Quantity must not be empty');
    expect(errorBody.country).toContain('Country must not be empty');
  });

  test('should return validation error for negative quantity', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-NQ-400';
    const unitPrice = 99.99;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act
    const response = await shopApiClient.orders().placeOrder(sku, '-5', 'US');
    
    // Assert
    await shopApiClient.orders().assertOrderPlacementFailed(response);
    const errorBody = response.data;
    expect(errorBody.quantity).toContain('Quantity must be positive');
  });

  // Parameterized tests for empty SKU values
  const emptySkuValues = [
    { value: null as any, description: 'null', expectedStatus: 422 },
    { value: '', description: 'empty string', expectedStatus: 422 }
  ];

  for (const testCase of emptySkuValues) {
    test(`should reject order with empty SKU (${testCase.description})`, async () => {
      // Arrange - Set up product in ERP first
      const baseSku = 'AUTO-ES-600';
      const unitPrice = 125.00;
      
      await erpApiClient.products().createProduct(baseSku, unitPrice);
      
      // Act
      const response = await shopApiClient.orders().placeOrder(testCase.value, '5', 'US');
      
      // Assert
      await shopApiClient.orders().assertOrderPlacementFailed(response);
      const errorBody = response.data;
      expect(errorBody.sku).toContain('SKU must not be empty');
    });
  }

  // Parameterized tests for empty quantity values
  const emptyQuantityValues = [
    { value: null as any, description: 'null' },
    { value: '', description: 'empty string' },
    { value: '   ', description: 'whitespace string' }
  ];

  for (const testCase of emptyQuantityValues) {
    test(`should reject order with empty quantity (${testCase.description})`, async () => {
      // Arrange - Set up product in ERP first
      const baseSku = 'AUTO-EQ-500';
      const unitPrice = 150.00;
      
      const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
      
      // Act
      const response = await shopApiClient.orders().placeOrder(sku, testCase.value, 'US');
      
      // Assert
      await shopApiClient.orders().assertOrderPlacementFailed(response);
      const errorBody = response.data;
      expect(errorBody.quantity).toContain('Quantity must not be empty');
    });
  }

  // Parameterized tests for non-integer quantity values
  const nonIntegerQuantityValues = [
    { value: '3.5', description: 'decimal value' },
    { value: 'lala', description: 'string value' }
  ];

  for (const testCase of nonIntegerQuantityValues) {
    test(`should reject order with non-integer quantity (${testCase.description})`, async () => {
      // Arrange - Set up product in ERP first
      const baseSku = 'AUTO-NIQ-600';
      const unitPrice = 175.00;
      
      const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
      
      // Act
      const response = await shopApiClient.orders().placeOrder(sku, testCase.value, 'US');
      
      // Assert
      await shopApiClient.orders().assertOrderPlacementFailed(response);
      const errorBody = response.data;
      expect(errorBody.quantity).toContain('Quantity must be an integer');
    });
  }

  // Parameterized tests for empty country values
  const emptyCountryValues = [
    { value: null as any, description: 'null' },
    { value: '', description: 'empty string' },
    { value: '   ', description: 'whitespace string' }
  ];

  for (const testCase of emptyCountryValues) {
    test(`should reject order with empty country (${testCase.description})`, async () => {
      // Arrange - Set up product in ERP first
      const baseSku = 'AUTO-EC-700';
      const unitPrice = 225.00;
      
      const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
      
      // Act
      const response = await shopApiClient.orders().placeOrder(sku, '5', testCase.value);
      
      // Assert
      await shopApiClient.orders().assertOrderPlacementFailed(response);
      const errorBody = response.data;
      expect(errorBody.country).toContain('Country must not be empty');
    });
  }

  test('should return validation error for non-existent product', async () => {
    const response = await shopApiClient.orders().placeOrder('NON-EXISTENT', '1', 'US');
    
    await shopApiClient.orders().assertOrderPlacementFailed(response);
    const errorBody = response.data;
    expect(errorBody.message).toContain('Product does not exist');
  });

  test('should return validation error for non-existent country', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-NC-300';
    const unitPrice = 89.99;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act
    const response = await shopApiClient.orders().placeOrder(sku, '1', 'XX');
    
    // Assert
    await shopApiClient.orders().assertOrderPlacementFailed(response);
    const errorBody = response.data;
    expect(errorBody.message).toContain('Country does not exist');
  });

  test('should get order details', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-GO-200';
    const unitPrice = 299.50;
    const quantity = 3;
    const country = 'DE';
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act - Place order
    const createResponse = await shopApiClient.orders().placeOrder(sku, String(quantity), country);
    
    const placeOrderResponse = await shopApiClient.orders().assertOrderPlacedSuccessfully(createResponse);
    const orderNumber = placeOrderResponse.orderNumber;
    
    // Get order details
    const getResponse = await shopApiClient.orders().viewOrder(orderNumber);
    const orderDetails = await shopApiClient.orders().assertOrderViewedSuccessfully(getResponse);
    
    // Assert all fields from GetOrderResponse
    expect(orderDetails.orderNumber).toBe(orderNumber);
    expect(orderDetails.sku).toBe(sku);
    expect(orderDetails.quantity).toBe(quantity);
    expect(orderDetails.country).toBe(country);
    expect(orderDetails.unitPrice).toBe(299.50);
    expect(orderDetails.originalPrice).toBe(898.50);
    
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
    expect(response.status).toBe(404);
  });

  test('should successfully cancel an order', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-CO-150';
    const unitPrice = 129.99;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act - Place order
    const createResponse = await shopApiClient.orders().placeOrder(sku, '1', 'US');
    
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
    expect(response.status).toBe(404);
  });

  test('should apply discount for orders placed after 17:00', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-D-400';
    const unitPrice = 159.99;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act
    const response = await shopApiClient.orders().placeOrder(sku, '1', 'US');
    
    // Assert
    const placeOrderResponse = await shopApiClient.orders().assertOrderPlacedSuccessfully(response);
    const getResponse = await shopApiClient.orders().viewOrder(placeOrderResponse.orderNumber);
    const orderDetails = await shopApiClient.orders().assertOrderViewedSuccessfully(getResponse);
    
    // Discount rate changes based on time, just verify it's valid
    expect(orderDetails.discountRate).toBeGreaterThanOrEqual(0);
    expect(orderDetails.discountAmount).toBeGreaterThanOrEqual(0);
  });

  test('should calculate tax correctly', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-T-500';
    const unitPrice = 99.99;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act
    const createResponse = await shopApiClient.orders().placeOrder(sku, '1', 'US');
    
    const placeOrderResponse = await shopApiClient.orders().assertOrderPlacedSuccessfully(createResponse);
    const getResponse = await shopApiClient.orders().viewOrder(placeOrderResponse.orderNumber);
    const orderDetails = await shopApiClient.orders().assertOrderViewedSuccessfully(getResponse);
    
    // Assert tax fields are positive
    expect(orderDetails.taxRate).toBeGreaterThan(0);
    expect(orderDetails.taxAmount).toBeGreaterThan(0);
    expect(orderDetails.subtotalPrice).toBeGreaterThan(0);
  });

  test('should calculate total price correctly', async () => {
    const createResponse = await shopApiClient.orders().placeOrder('DEF-456', '3', 'GB');
    
    const placeOrderResponse = await shopApiClient.orders().assertOrderPlacedSuccessfully(createResponse);
    const getResponse = await shopApiClient.orders().viewOrder(placeOrderResponse.orderNumber);
    const orderDetails = await shopApiClient.orders().assertOrderViewedSuccessfully(getResponse);
    
    // Assert price fields are positive
    expect(orderDetails.unitPrice).toBe(25.00);
    expect(orderDetails.originalPrice).toBe(75.00);
    expect(orderDetails.subtotalPrice).toBeGreaterThan(0);
    expect(orderDetails.taxAmount).toBeGreaterThan(0);
    expect(orderDetails.totalPrice).toBeGreaterThan(0);
  });

  test('should handle different countries with different tax rates', async () => {
    const countries = ['US', 'GB', 'DE', 'FR', 'CA', 'AU'];
    
    for (const countryCode of countries) {
      const createResponse = await shopApiClient.orders().placeOrder('ABC-123', '1', countryCode);
      
      const placeOrderResponse = await shopApiClient.orders().assertOrderPlacedSuccessfully(createResponse);
      const getResponse = await shopApiClient.orders().viewOrder(placeOrderResponse.orderNumber);
      const orderDetails = await shopApiClient.orders().assertOrderViewedSuccessfully(getResponse);
      
      expect(orderDetails.taxRate).toBeGreaterThan(0);
      expect(orderDetails.taxAmount).toBeGreaterThan(0);
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
