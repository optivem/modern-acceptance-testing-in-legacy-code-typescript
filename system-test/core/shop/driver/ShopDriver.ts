import { Result } from '@optivem/lang';
import { PlaceOrderResponse } from './dtos/PlaceOrderResponse.js';
import { GetOrderResponse } from './dtos/GetOrderResponse.js';

export interface ShopDriver {
    goToShop(): Promise<Result<void>>;
    placeOrder(sku: string, quantity: string, country: string): Promise<Result<PlaceOrderResponse>>;
    viewOrder(orderNumber: string): Promise<Result<GetOrderResponse>>;
    cancelOrder(orderNumber: string): Promise<Result<void>>;
    close(): Promise<void>;
}
