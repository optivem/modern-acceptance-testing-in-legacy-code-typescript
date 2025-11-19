import { IsNotEmpty, IsPositive, IsInt } from 'class-validator';

/**
 * Represents an integer value (whole number)
 */
export type Integer = number;

/**
 * Represents a decimal value (floating-point number)
 */
export type Decimal = number;

export class PlaceOrderRequest {
  @IsNotEmpty({ message: 'SKU must not be empty' })
  sku!: string;

  @IsPositive({ message: 'Quantity must be positive' })
  @IsInt({ message: 'Quantity must be an integer' })
  @IsNotEmpty({ message: 'Quantity must not be empty' })
  quantity!: Integer;

  @IsNotEmpty({ message: 'Country must not be empty' })
  country!: string;
}

export class PlaceOrderResponse {
  orderNumber!: string;
}

export class GetOrderResponse {
  orderNumber!: string;
  sku!: string;
  quantity!: Integer;
  unitPrice!: Decimal;
  originalPrice!: Decimal;
  discountRate!: Decimal;
  discountAmount!: Decimal;
  subtotalPrice!: Decimal;
  taxRate!: Decimal;
  taxAmount!: Decimal;
  totalPrice!: Decimal;
  status!: string;
  country!: string;
}
