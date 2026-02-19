import type { Optional, Result } from '@optivem/commons/util';
import { Integer } from '@optivem/commons/util';
import type { OrderDriver } from '../../internal/OrderDriver.js';
import type { PlaceOrderRequest, PlaceOrderResponse, ViewOrderResponse } from '../../../commons/dtos/orders/index.js';
import type { SystemError } from '../../../commons/dtos/errors/SystemError.js';
import { failure, failureWithError, success, successVoid } from '../../../commons/SystemResults.js';
import type { HomePage } from '../../../client/ui/pages/HomePage.js';
import { PageNavigator, Page } from './PageNavigator.js';
import { NewOrderPage } from '../../../client/ui/pages/NewOrderPage.js';
import { OrderHistoryPage } from '../../../client/ui/pages/OrderHistoryPage.js';
import { OrderDetailsPage } from '../../../client/ui/pages/OrderDetailsPage.js';
import { OrderStatus } from '../../../commons/dtos/orders/OrderStatus.js';

export class ShopUiOrderDriver implements OrderDriver {
    private newOrderPage?: NewOrderPage;
    private orderHistoryPage?: OrderHistoryPage;
    private orderDetailsPage?: OrderDetailsPage;

    constructor(
        private readonly homePageSupplier: () => Promise<HomePage>,
        private readonly pageNavigator: PageNavigator
    ) {}

    async placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, SystemError>> {
        await this.ensureOnNewOrderPage();
        const page = this.newOrderPage!;
        await page.inputSku(request.sku);
        await page.inputQuantity(request.quantity);
        await page.inputCountry(request.country);
        await page.inputCouponCode(request.couponCode);
        await page.clickPlaceOrder();
        const hasSuccess = await page.hasSuccessNotification();
        if (!hasSuccess) {
            const messages = await page.readErrorNotification();
            return failure(messages.join(', '));
        }
        const orderNumber = await page.getOrderNumber();
        return success({ orderNumber });
    }

    async viewOrder(orderNumber: Optional<string>): Promise<Result<ViewOrderResponse, SystemError>> {
        const ensured = await this.ensureOnOrderDetailsPage(orderNumber);
        if (ensured.isFailure()) return failureWithError(ensured.getError());
        const page = this.orderDetailsPage!;
        const isLoaded = await page.isLoadedSuccessfully();
        if (!isLoaded) {
            return failure('Order details did not load');
        }
        const orderNumberVal = await page.getOrderNumber();
        const orderTimestamp = await page.getOrderTimestamp();
        const sku = await page.getSku();
        const quantity = await page.getQuantity();
        const country = await page.getCountry();
        const unitPrice = await page.getUnitPrice();
        const basePrice = await page.getBasePrice();
        const discountRate = await page.getDiscountRate();
        const discountAmount = await page.getDiscountAmount();
        const subtotalPrice = await page.getSubtotalPrice();
        const taxRate = await page.getTaxRate();
        const taxAmount = await page.getTaxAmount();
        const totalPrice = await page.getTotalPrice();
        const status = await page.getStatus();
        const appliedCouponCode = await page.getAppliedCoupon();
        return success({
            orderNumber: orderNumberVal,
            orderTimestamp,
            sku,
            quantity: Integer.fromNumber(quantity),
            country,
            unitPrice,
            basePrice,
            discountRate,
            discountAmount,
            subtotalPrice,
            taxRate,
            taxAmount,
            totalPrice,
            status,
            appliedCouponCode,
        });
    }

    async cancelOrder(orderNumber: Optional<string>): Promise<Result<void, SystemError>> {
        const viewResult = await this.viewOrder(orderNumber);
        if (viewResult.isFailure()) return viewResult.mapVoid();
        await this.orderDetailsPage!.clickCancelOrder();
        const hasSuccess = await this.orderDetailsPage!.hasSuccessNotification();
        if (!hasSuccess) {
            return failure('Did not receive expected cancellation success message');
        }
        const message = await this.orderDetailsPage!.readSuccessNotification();
        if (message !== 'Order cancelled successfully!') {
            return failure('Did not receive expected cancellation success message');
        }
        const statusAfter = await this.orderDetailsPage!.getStatus();
        if (statusAfter !== OrderStatus.CANCELLED) {
            return failure('Order status not updated to CANCELLED');
        }
        const cancelHidden = await this.orderDetailsPage!.isCancelButtonHidden();
        if (!cancelHidden) {
            return failure('Cancel button still visible');
        }
        return successVoid();
    }

    private async ensureOnNewOrderPage(): Promise<void> {
        if (this.pageNavigator.getCurrentPage() !== Page.NEW_ORDER) {
            const homePage = await this.homePageSupplier();
            this.newOrderPage = await homePage.clickNewOrder();
            this.pageNavigator.setCurrentPage(Page.NEW_ORDER);
        }
    }

    private async ensureOnOrderHistoryPage(): Promise<void> {
        if (this.pageNavigator.getCurrentPage() !== Page.ORDER_HISTORY) {
            const homePage = await this.homePageSupplier();
            this.orderHistoryPage = await homePage.clickOrderHistory();
            this.pageNavigator.setCurrentPage(Page.ORDER_HISTORY);
        }
    }

    private async ensureOnOrderDetailsPage(orderNumber: Optional<string>): Promise<Result<void, SystemError>> {
        await this.ensureOnOrderHistoryPage();
        await this.orderHistoryPage!.inputOrderNumber(orderNumber);
        await this.orderHistoryPage!.clickSearch();
        const isListed = await this.orderHistoryPage!.isOrderListed(orderNumber);
        if (!isListed) {
            return failure(`Order ${orderNumber} does not exist.`);
        }
        this.orderDetailsPage = await this.orderHistoryPage!.clickViewOrderDetails(orderNumber);
        this.pageNavigator.setCurrentPage(Page.ORDER_DETAILS);
        return successVoid();
    }
}
