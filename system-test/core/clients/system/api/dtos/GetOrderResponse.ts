import { OrderStatus } from './enums/OrderStatus';

/**
 * Represents an integer value (whole number)
 */
export type Integer = number;

/**
 * Represents a decimal value (floating-point number)
 */
export type Decimal = number;

export interface GetOrderResponse {
  orderNumber: string;
  sku: string;
  /** Quantity must be a whole number */
  quantity: Integer;
  unitPrice: Decimal;
  originalPrice: Decimal;
  discountRate: Decimal;
  discountAmount: Decimal;
  subtotalPrice: Decimal;
  taxRate: Decimal;
  taxAmount: Decimal;
  totalPrice: Decimal;
  status: OrderStatus;
  country: string;
}
