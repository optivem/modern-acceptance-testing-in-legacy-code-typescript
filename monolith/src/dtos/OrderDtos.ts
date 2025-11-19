import { IsNotEmpty, IsPositive, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Represents an integer value (whole number)
 */
export type Integer = number;

/**
 * Represents a decimal value (floating-point number)
 */
export type Decimal = number;

export class PlaceOrderRequest {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsNotEmpty({ message: 'SKU must not be empty' })
  sku!: string;

  @Transform(({ value }) => {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return value;
    }
    // Handle string values
    if (typeof value === 'string') {
      const trimmed = value.trim();
      // Keep empty string as empty string (already handled in controller)
      if (trimmed === '') {
        return '';
      }
      // Convert non-empty string to number
      return Number(trimmed);
    }
    // Return other types as-is
    return value;
  })
  @IsPositive({ message: 'Quantity must be positive' })
  @IsInt({ message: 'Quantity must be an integer' })
  quantity!: Integer;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
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
