import { ShopDriver } from '../ShopDriver.js';
import { ShopUiClient } from './client/ShopUiClient.js';
import { HomePage } from './client/pages/HomePage.js';
import { NewOrderPage } from './client/pages/NewOrderPage.js';
import { OrderHistoryPage } from './client/pages/OrderHistoryPage.js';
import { Result } from '@optivem/lang';
import { PlaceOrderResponse } from '../dtos/PlaceOrderResponse.js';
import { GetOrderResponse } from '../dtos/GetOrderResponse.js';
import { OrderStatus } from '../dtos/enums/OrderStatus.js';
import { Error, createError } from '../../../core-commons/error/index.js';

enum Pages {
    NONE = 'NONE',
    HOME = 'HOME',
    NEW_ORDER = 'NEW_ORDER',
    ORDER_HISTORY = 'ORDER_HISTORY',
}

export class ShopUiDriver implements ShopDriver {
    private readonly client: ShopUiClient;

    private homePage?: HomePage;
    private newOrderPage?: NewOrderPage;
    private orderHistoryPage?: OrderHistoryPage;

    private currentPage: Pages = Pages.NONE;

    constructor(baseUrl: string) {
        this.client = new ShopUiClient(baseUrl);
    }

    async goToShop(): Promise<Result<void, Error>> {
        this.homePage = await this.client.openHomePage();

        if (!this.client.isStatusOk() || !(await this.client.isPageLoaded())) {
            return Result.failure(createError('Failed to load shop page'));
        }

        this.currentPage = Pages.HOME;
        return Result.success();
    }

    async placeOrder(sku: string, quantity: string, country: string): Promise<Result<PlaceOrderResponse, Error>> {
        await this.ensureOnNewOrderPage();
        
        await this.newOrderPage!.inputSku(sku);
        await this.newOrderPage!.inputQuantity(quantity);
        await this.newOrderPage!.inputCountry(country);
        await this.newOrderPage!.clickPlaceOrder();

        const isSuccess = await this.newOrderPage!.hasSuccessNotification();

        if (!isSuccess) {
            const errorMessages = await this.newOrderPage!.readErrorNotification();
            return Result.failure(createError(errorMessages.join(', ')));
        }

        const orderNumberValue = await this.newOrderPage!.getOrderNumber();
        const response: PlaceOrderResponse = { orderNumber: orderNumberValue };
        return Result.success(response);
    }

    async viewOrder(orderNumber: string): Promise<Result<GetOrderResponse, Error>> {
        await this.ensureOnOrderHistoryPage();
        
        await this.orderHistoryPage!.inputOrderNumber(orderNumber);
        await this.orderHistoryPage!.clickSearch();

        const isSuccess = await this.orderHistoryPage!.hasOrderDetails();

        if (!isSuccess) {
            const errorMessages = await this.orderHistoryPage!.readErrorNotification();
            return Result.failure(createError(errorMessages.join(', ')));
        }

        const displayOrderNumber = await this.orderHistoryPage!.getOrderNumber();
        const sku = await this.orderHistoryPage!.getSku();
        const quantityValue = await this.orderHistoryPage!.getQuantity();
        const countryValue = await this.orderHistoryPage!.getCountry();
        const unitPrice = await this.orderHistoryPage!.getUnitPrice();
        const originalPrice = await this.orderHistoryPage!.getOriginalPrice();
        const discountRate = await this.orderHistoryPage!.getDiscountRate();
        const discountAmount = await this.orderHistoryPage!.getDiscountAmount();
        const subtotalPrice = await this.orderHistoryPage!.getSubtotalPrice();
        const taxRate = await this.orderHistoryPage!.getTaxRate();
        const taxAmount = await this.orderHistoryPage!.getTaxAmount();
        const totalPrice = await this.orderHistoryPage!.getTotalPrice();
        const status = await this.orderHistoryPage!.getStatus();

        const response: GetOrderResponse = {
            orderNumber: displayOrderNumber,
            sku,
            quantity: quantityValue,
            unitPrice,
            originalPrice,
            discountRate,
            discountAmount,
            subtotalPrice,
            taxRate,
            taxAmount,
            totalPrice,
            country: countryValue,
            status,
        };

        return Result.success(response);
    }

    async cancelOrder(orderNumber: string): Promise<Result<void, Error>> {
        const viewResult = await this.viewOrder(orderNumber);
        
        // If order doesn't exist, return the failure from viewOrder
        if (!viewResult.isSuccess()) {
            return Result.failure(viewResult.getError());
        }

        // Check if cancel button exists
        const hasCancelButton = !(await this.orderHistoryPage!.isCancelButtonHidden());
        if (!hasCancelButton) {
            return Result.failure(createError('Order has already been cancelled'));
        }

        await this.orderHistoryPage!.clickCancelOrder();

        const cancellationMessage = await this.orderHistoryPage!.readSuccessNotification();
        if (cancellationMessage !== 'Order cancelled successfully!') {
            return Result.failure(createError('Cancellation was not confirmed'));
        }

        const displayStatusAfterCancel = await this.orderHistoryPage!.getStatus();
        if (displayStatusAfterCancel !== OrderStatus.CANCELLED) {
            return Result.failure(createError('Order status was not updated to cancelled'));
        }

        if (!(await this.orderHistoryPage!.isCancelButtonHidden())) {
            return Result.failure(createError('Cancel button should be hidden after cancellation'));
        }

        return Result.success();
    }

    async close(): Promise<void> {
        await this.client.close();
    }

    private async ensureOnNewOrderPage(): Promise<void> {
        if (this.currentPage !== Pages.NEW_ORDER) {
            this.homePage = await this.client.openHomePage();
            this.newOrderPage = await this.homePage.clickNewOrder();
            this.currentPage = Pages.NEW_ORDER;
        }
    }

    private async ensureOnOrderHistoryPage(): Promise<void> {
        if (this.currentPage !== Pages.ORDER_HISTORY) {
            this.homePage = await this.client.openHomePage();
            this.orderHistoryPage = await this.homePage.clickOrderHistory();
            this.currentPage = Pages.ORDER_HISTORY;
        }
    }
}
