import { test, expect } from '@playwright/test';
import { ClientFactory } from '../../core/clients/ClientFactory';
import { ClientCloser } from '../../core/clients/ClientCloser';
import { ShopUiClient } from '../../core/clients/system/ui/ShopUiClient';
import { ErpApiClient } from '../../core/clients/external/erp/ErpApiClient';

test.describe('UI E2E Tests', () => {
  let shopUiClient: ShopUiClient;
  let erpApiClient: ErpApiClient;

  test.beforeEach(async () => {
    shopUiClient = await ClientFactory.createShopUiClient();
    erpApiClient = await ClientFactory.createErpApiClient();
  });

  test.afterEach(async () => {
    await ClientCloser.close(shopUiClient);
    await ClientCloser.close(erpApiClient);
  });
  
  test('should successfully place an order with valid data', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-UI-100';
    const unitPrice = 199.99;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();
    
    await newOrderPage.inputProductId(sku);
    await newOrderPage.inputQuantity(2);
    await newOrderPage.inputCountry('US');
    
    await newOrderPage.clickPlaceOrder();
    
    // Assert
    await newOrderPage.assertOrderPlacedSuccessfully();
  });

  test('should show validation error for empty SKU', async () => {
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();
    
    await newOrderPage.inputProductId('');
    await newOrderPage.inputQuantity(1);
    await newOrderPage.inputCountry('US');
    
    await newOrderPage.clickPlaceOrder();
    
    await newOrderPage.assertSkuError('SKU must not be empty');
  });

  test('should show validation error for empty quantity', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-EQ-200';
    const unitPrice = 89.99;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();
    
    await newOrderPage.inputProductId(sku);
    await newOrderPage.inputQuantity('');
    await newOrderPage.inputCountry('US');
    
    await newOrderPage.clickPlaceOrder();
    
    // Assert
    await newOrderPage.assertQuantityError('Quantity must not be empty');
  });

  test('should show validation error for non-positive quantity', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-NQ-300';
    const unitPrice = 129.99;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();
    
    await newOrderPage.inputProductId(sku);
    await newOrderPage.inputQuantity(-1);
    await newOrderPage.inputCountry('US');
    
    await newOrderPage.clickPlaceOrder();
    
    // Assert
    await newOrderPage.assertQuantityError('Quantity must be positive');
  });

  test('should show validation error for empty country', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-EC-400';
    const unitPrice = 149.99;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();
    
    await newOrderPage.inputProductId(sku);
    await newOrderPage.inputQuantity(1);
    await newOrderPage.inputCountry('');
    
    await newOrderPage.clickPlaceOrder();
    
    // Assert
    await newOrderPage.assertCountryError('Country must not be empty');
  });

  test('should show error for non-existent product SKU', async () => {
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();
    
    await newOrderPage.inputProductId('NON-EXISTENT');
    await newOrderPage.inputQuantity(1);
    await newOrderPage.inputCountry('US');
    
    await newOrderPage.clickPlaceOrder();
    
    await newOrderPage.assertOrderError('Product does not exist');
  });

  test('should show error for non-existent country', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-NC-500';
    const unitPrice = 169.99;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();
    
    await newOrderPage.inputProductId(sku);
    await newOrderPage.inputQuantity(1);
    await newOrderPage.inputCountry('XX');
    
    await newOrderPage.clickPlaceOrder();
    
    // Assert
    await newOrderPage.assertOrderError('Country does not exist');
  });

  test('should display order details', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-OD-600';
    const unitPrice = 299.50;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act - Place an order
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();
    
    await newOrderPage.inputProductId(sku);
    await newOrderPage.inputQuantity(1);
    await newOrderPage.inputCountry('US');
    await newOrderPage.clickPlaceOrder();
    
    // Extract order number
    const orderNumber = await newOrderPage.extractOrderNumber();
    expect(orderNumber).toBeTruthy();
    
    // Navigate back to home page first
    const homePageAgain = await shopUiClient.openHomePage();
    
    // Navigate to order history
    const orderHistoryPage = await homePageAgain.clickOrderHistory();
    await orderHistoryPage.inputOrderNumber(orderNumber!);
    await orderHistoryPage.clickViewOrder();
    
    // Assert - Verify order details
    await orderHistoryPage.assertOrderNumber(orderNumber!);
    await orderHistoryPage.assertOrderDetails({
      sku: sku,
      quantity: '1',
      country: 'US',
      unitPrice: '$299.50',
      originalPrice: '$299.50',
      status: 'PLACED'
    });
  });

  test('should successfully cancel an order', async () => {
    // Arrange - Set up product in ERP first
    const baseSku = 'AUTO-CO-700';
    const unitPrice = 179.99;
    
    const sku = await erpApiClient.products().createProduct(baseSku, unitPrice);
    
    // Act - Place an order
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();
    
    await newOrderPage.inputProductId(sku);
    await newOrderPage.inputQuantity(1);
    await newOrderPage.inputCountry('US');
    await newOrderPage.clickPlaceOrder();
    
    const orderNumber = await newOrderPage.extractOrderNumber();
    expect(orderNumber).toBeTruthy();
    
    // Navigate back to home page first
    const homePageAgain = await shopUiClient.openHomePage();
    
    // Navigate to order history
    const orderHistoryPage = await homePageAgain.clickOrderHistory();
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
