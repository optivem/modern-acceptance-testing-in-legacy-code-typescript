import { IsNotEmpty, IsPositive, IsInt } from 'class-validator';

export class PlaceOrderRequest {
  @IsNotEmpty({ message: 'SKU must not be empty' })
  sku!: string;

  @IsNotEmpty({ message: 'Quantity must not be empty' })
  @IsInt({ message: 'Quantity must be an integer' })
  @IsPositive({ message: 'Quantity must be positive' })
  quantity!: number;

  @IsNotEmpty({ message: 'Country must not be empty' })
  country!: string;
}

export class PlaceOrderResponse {
  orderNumber!: string;
}

export class GetOrderResponse {
  orderNumber!: string;
  sku!: string;
  quantity!: number;
  unitPrice!: number;
  originalPrice!: number;
  discountRate!: number;
  discountAmount!: number;
  subtotalPrice!: number;
  taxRate!: number;
  taxAmount!: number;
  totalPrice!: number;
  status!: string;
  country!: string;
}
