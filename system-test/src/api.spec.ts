import { test, expect, request } from '@playwright/test';

const BASE_URL = 'http://localhost:8082';

test.describe('API E2E Tests', () => {
  
  test('should successfully place an order with valid data', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        sku: 'ABC-123',
        quantity: 1,
        country: 'US'
      }
    });
    
    expect(response.status()).toBe(201);
    
    const body = await response.json();
    expect(body.orderNumber).toMatch(/ORD-/);
    
    const locationHeader = response.headers()['location'];
    expect(locationHeader).toContain(`/api/orders/${body.orderNumber}`);
  });

  test('should return validation errors for empty fields', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        sku: '',
        quantity: '',
        country: ''
      }
    });
    
    expect(response.status()).toBe(422);
    
    const body = await response.json();
    expect(body.sku).toContain('SKU must not be empty');
    expect(body.quantity).toContain('Quantity must not be empty');
    expect(body.country).toContain('Country must not be empty');
  });

  test('should return validation error for non-positive quantity', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        sku: 'ABC-123',
        quantity: -1,
        country: 'US'
      }
    });
    
    expect(response.status()).toBe(422);
    
    const body = await response.json();
    expect(body.quantity).toContain('Quantity must be positive');
  });

  test('should return validation error for zero quantity', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        sku: 'ABC-123',
        quantity: 0,
        country: 'US'
      }
    });
    
    expect(response.status()).toBe(422);
    
    const body = await response.json();
    expect(body.quantity).toContain('Quantity must be positive');
  });

  test('should return validation error for non-existent product', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        sku: 'NON-EXISTENT',
        quantity: 1,
        country: 'US'
      }
    });
    
    expect(response.status()).toBe(422);
    
    const body = await response.json();
    expect(body.message).toContain('Product does not exist');
  });

  test('should return validation error for non-existent country', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        sku: 'ABC-123',
        quantity: 1,
        country: 'XX'
      }
    });
    
    expect(response.status()).toBe(422);
    
    const body = await response.json();
    expect(body.message).toContain('Country does not exist');
  });

  test('should get order details', async ({ request }) => {
    // First place an order
    const createResponse = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        sku: 'ABC-123',
        quantity: 2,
        country: 'US'
      }
    });
    
    const createBody = await createResponse.json();
    const orderNumber = createBody.orderNumber;
    
    // Get order details
    const getResponse = await request.get(`${BASE_URL}/api/orders/${orderNumber}`);
    
    expect(getResponse.status()).toBe(200);
    
    const orderDetails = await getResponse.json();
    expect(orderDetails.orderNumber).toBe(orderNumber);
    expect(orderDetails.sku).toBe('ABC-123');
    expect(orderDetails.quantity).toBe(2);
    expect(orderDetails.country).toBe('US');
    expect(orderDetails.status).toBe('PLACED');
    expect(orderDetails.unitPrice).toBe(1500.00);
    expect(orderDetails.originalPrice).toBe(3000.00);
  });

  test('should return 404 for non-existent order', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/orders/NON-EXISTENT`);
    
    expect(response.status()).toBe(404);
  });

  test('should successfully cancel an order', async ({ request }) => {
    // First place an order
    const createResponse = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        sku: 'ABC-123',
        quantity: 1,
        country: 'US'
      }
    });
    
    const createBody = await createResponse.json();
    const orderNumber = createBody.orderNumber;
    
    // Cancel the order
    const cancelResponse = await request.post(`${BASE_URL}/api/orders/${orderNumber}/cancel`);
    
    expect(cancelResponse.status()).toBe(204);
    
    // Verify order is cancelled
    const getResponse = await request.get(`${BASE_URL}/api/orders/${orderNumber}`);
    const orderDetails = await getResponse.json();
    expect(orderDetails.status).toBe('CANCELLED');
  });

  test('should return 404 when cancelling non-existent order', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/orders/NON-EXISTENT/cancel`);
    
    expect(response.status()).toBe(404);
  });

  test('should apply discount for orders placed after 17:00', async ({ request }) => {
    // This test depends on the current time
    const now = new Date();
    const hour = now.getHours();
    
    const response = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        sku: 'ABC-123',
        quantity: 1,
        country: 'US'
      }
    });
    
    const createBody = await response.json();
    const getResponse = await request.get(`${BASE_URL}/api/orders/${createBody.orderNumber}`);
    const orderDetails = await getResponse.json();
    
    if (hour >= 17) {
      expect(orderDetails.discountRate).toBe(0.15);
      expect(orderDetails.discountAmount).toBeGreaterThan(0);
    } else {
      expect(orderDetails.discountRate).toBe(0);
      expect(orderDetails.discountAmount).toBe(0);
    }
  });

  test('should calculate tax correctly', async ({ request }) => {
    const createResponse = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        sku: 'ABC-123',
        quantity: 1,
        country: 'US'
      }
    });
    
    const createBody = await createResponse.json();
    const getResponse = await request.get(`${BASE_URL}/api/orders/${createBody.orderNumber}`);
    const orderDetails = await getResponse.json();
    
    // US tax rate is 7.25%
    expect(orderDetails.taxRate).toBe(0.0725);
    
    const expectedTaxAmount = orderDetails.subtotalPrice * 0.0725;
    expect(Math.abs(orderDetails.taxAmount - expectedTaxAmount)).toBeLessThan(0.01);
  });

  test('should calculate total price correctly', async ({ request }) => {
    const createResponse = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        sku: 'DEF-456',
        quantity: 3,
        country: 'GB'
      }
    });
    
    const createBody = await createResponse.json();
    const getResponse = await request.get(`${BASE_URL}/api/orders/${createBody.orderNumber}`);
    const orderDetails = await getResponse.json();
    
    // Unit price: 25.00, Quantity: 3
    expect(orderDetails.unitPrice).toBe(25.00);
    expect(orderDetails.originalPrice).toBe(75.00);
    
    const expectedSubtotal = orderDetails.originalPrice - orderDetails.discountAmount;
    expect(Math.abs(orderDetails.subtotalPrice - expectedSubtotal)).toBeLessThan(0.01);
    
    const expectedTotal = orderDetails.subtotalPrice + orderDetails.taxAmount;
    expect(Math.abs(orderDetails.totalPrice - expectedTotal)).toBeLessThan(0.01);
  });

  test('should handle different countries with different tax rates', async ({ request }) => {
    const countries = [
      { code: 'US', taxRate: 0.0725 },
      { code: 'GB', taxRate: 0.20 },
      { code: 'DE', taxRate: 0.19 },
      { code: 'FR', taxRate: 0.20 },
      { code: 'CA', taxRate: 0.13 },
      { code: 'AU', taxRate: 0.10 }
    ];
    
    for (const country of countries) {
      const createResponse = await request.post(`${BASE_URL}/api/orders`, {
        data: {
          sku: 'ABC-123',
          quantity: 1,
          country: country.code
        }
      });
      
      const createBody = await createResponse.json();
      const getResponse = await request.get(`${BASE_URL}/api/orders/${createBody.orderNumber}`);
      const orderDetails = await getResponse.json();
      
      expect(orderDetails.taxRate).toBe(country.taxRate);
    }
  });

  test('should handle multiple products', async ({ request }) => {
    const products = ['ABC-123', 'DEF-456', 'GHI-789', 'JKL-012', 'MNO-345'];
    
    for (const sku of products) {
      const response = await request.post(`${BASE_URL}/api/orders`, {
        data: {
          sku: sku,
          quantity: 1,
          country: 'US'
        }
      });
      
      expect(response.status()).toBe(201);
      
      const body = await response.json();
      expect(body.orderNumber).toMatch(/ORD-/);
    }
  });
});
