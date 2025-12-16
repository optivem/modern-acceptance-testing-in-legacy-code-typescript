import { Result } from '@optivem/lang';
import { PlaceOrderResponse } from './dtos/PlaceOrderResponse.js';
import { GetOrderResponse } from './dtos/GetOrderResponse.js';
import { Error } from '../../commons/error/index.js';

export interface ShopDriver {
    goToShop(): Promise<Result<void, Error>>;
    placeOrder(sku: string, quantity: string, country: string): Promise<Result<PlaceOrderResponse, Error>>;
    viewOrder(orderNumber: string): Promise<Result<GetOrderResponse, Error>>;
    cancelOrder(orderNumber: string): Promise<Result<void, Error>>;
    close(): Promise<void>;
}
