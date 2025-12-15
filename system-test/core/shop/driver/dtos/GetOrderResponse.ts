import { OrderStatus } from './enums/OrderStatus.js';

export interface GetOrderResponse {
    orderNumber: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    originalPrice: number;
    discountRate: number;
    discountAmount: number;
    subtotalPrice: number;
    taxRate: number;
    taxAmount: number;
    totalPrice: number;
    country: string;
    status: OrderStatus;
}
