import { OrderStatus } from './enums/OrderStatus.js';

export interface GetOrderResponse {
    orderNumber: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    subtotalPrice: number;
    discountRate: number;
    discountAmount: number;
    preTaxTotal: number;
    taxRate: number;
    taxAmount: number;
    totalPrice: number;
    country: string;
    status: OrderStatus;
}
