import { test, expect } from '@playwright/test';
import { ClientFactory } from '../../core/clients/ClientFactory';
import { ClientCloser } from '../../core/clients/ClientCloser';
import { ShopUiClient } from '../../core/clients/system/ui/ShopUiClient';

test.describe('UI E2E Tests', () => {
  let shopUiClient: ShopUiClient;

  test.beforeEach(async () => {
    shopUiClient = await ClientFactory.createShopUiClient();
  });

  test.afterEach(async () => {
    await ClientCloser.close(shopUiClient);
  });
  
  test('should successfully place an order with valid data', async () => {
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickShop();
    
    await newOrderPage.inputProductId('ABC-123');
    await newOrderPage.inputQuantity(2);
    await newOrderPage.inputCountry('US');
    
    await newOrderPage.clickPlaceOrder();
    
    await newOrderPage.assertOrderPlacedSuccessfully();
  });

  test('should show validation error for empty SKU', async () => {
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickShop();
    
    await newOrderPage.inputProductId('');
    await newOrderPage.inputQuantity(1);
    await newOrderPage.inputCountry('US');
    
    await newOrderPage.clickPlaceOrder();
    
    await newOrderPage.assertSkuError('SKU must not be empty');
  });

  test('should show validation error for empty quantity', async () => {
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickShop();
    
    await newOrderPage.inputProductId('ABC-123');
    await newOrderPage.inputQuantity(0);
    await newOrderPage.inputCountry('US');
    
    await newOrderPage.clickPlaceOrder();
    
    await newOrderPage.assertQuantityError('Quantity must not be empty');
  });

  test('should show validation error for non-positive quantity', async () => {
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickShop();
    
    await newOrderPage.inputProductId('ABC-123');
    await newOrderPage.inputQuantity(-1);
    await newOrderPage.inputCountry('US');
    
    await newOrderPage.clickPlaceOrder();
    
    await newOrderPage.assertQuantityError('Quantity must be positive');
  });

  test('should show validation error for empty country', async () => {
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickShop();
    
    await newOrderPage.inputProductId('ABC-123');
    await newOrderPage.inputQuantity(1);
    await newOrderPage.inputCountry('');
    
    await newOrderPage.clickPlaceOrder();
    
    await newOrderPage.assertCountryError('Country must not be empty');
  });

  test('should show error for non-existent product SKU', async () => {
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickShop();
    
    await newOrderPage.inputProductId('NON-EXISTENT');
    await newOrderPage.inputQuantity(1);
    await newOrderPage.inputCountry('US');
    
    await newOrderPage.clickPlaceOrder();
    
    await newOrderPage.assertOrderError('Product does not exist');
  });

  test('should show error for non-existent country', async () => {
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickShop();
    
    await newOrderPage.inputProductId('ABC-123');
    await newOrderPage.inputQuantity(1);
    await newOrderPage.inputCountry('XX');
    
    await newOrderPage.clickPlaceOrder();
    
    await newOrderPage.assertOrderError('Country does not exist');
  });

  test('should display order details', async () => {
    // First place an order
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickShop();
    
    await newOrderPage.inputProductId('ABC-123');
    await newOrderPage.inputQuantity(1);
    await newOrderPage.inputCountry('US');
    await newOrderPage.clickPlaceOrder();
    
    // Extract order number
    const orderNumber = await newOrderPage.extractOrderNumber();
    expect(orderNumber).toBeTruthy();
    
    // Navigate to order history
    const orderHistoryPage = await homePage.clickOrderHistory();
    await orderHistoryPage.inputOrderNumber(orderNumber!);
    await orderHistoryPage.clickViewOrder();
    
    // Verify order details
    await orderHistoryPage.assertOrderNumber(orderNumber!);
    await orderHistoryPage.assertOrderDetails({
      sku: 'ABC-123',
      quantity: '1',
      country: 'US',
      unitPrice: '$1500.00',
      originalPrice: '$1500.00',
      status: 'PLACED'
    });
  });

  test('should successfully cancel an order', async () => {
    // First place an order
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickShop();
    
    await newOrderPage.inputProductId('ABC-123');
    await newOrderPage.inputQuantity(1);
    await newOrderPage.inputCountry('US');
    await newOrderPage.clickPlaceOrder();
    
    const orderNumber = await newOrderPage.extractOrderNumber();
    
    // Navigate to order history
    const orderHistoryPage = await homePage.clickOrderHistory();
    await orderHistoryPage.inputOrderNumber(orderNumber!);
    await orderHistoryPage.clickViewOrder();
    
    // Cancel the order
    await orderHistoryPage.clickCancelOrder();
    
    // Verify cancellation
    await orderHistoryPage.assertCancellationSuccess();
    await orderHistoryPage.assertOrderDetails({ status: 'CANCELLED' });
  });

  test('should show not found for non-existent order', async () => {
    const homePage = await shopUiClient.openHomePage();
    const orderHistoryPage = await homePage.clickOrderHistory();
    
    await orderHistoryPage.inputOrderNumber('NON-EXISTENT-ORDER');
    await orderHistoryPage.clickViewOrder();
    
    await orderHistoryPage.assertOrderNotFound();
  });
});
