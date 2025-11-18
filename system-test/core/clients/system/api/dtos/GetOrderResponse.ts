import { OrderStatus } from './OrderStatus';

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
  status: OrderStatus;
  country: string;
}
