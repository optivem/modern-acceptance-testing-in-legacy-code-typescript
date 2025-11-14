import { Entity, PrimaryColumn, Column } from 'typeorm';

export enum OrderStatus {
  PLACED = 'PLACED',
  CANCELLED = 'CANCELLED'
}

@Entity('orders')
export class Order {
  @PrimaryColumn({ name: 'order_number', type: 'varchar', length: 100 })
  orderNumber!: string;

  @Column({ name: 'order_timestamp', type: 'timestamp' })
  orderTimestamp!: Date;

  @Column({ name: 'country', type: 'varchar', length: 10 })
  country!: string;

  @Column({ name: 'sku', type: 'varchar', length: 100 })
  sku!: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity!: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ name: 'original_price', type: 'decimal', precision: 10, scale: 2 })
  originalPrice!: number;

  @Column({ name: 'discount_rate', type: 'decimal', precision: 5, scale: 4 })
  discountRate!: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2 })
  discountAmount!: number;

  @Column({ name: 'subtotal_price', type: 'decimal', precision: 10, scale: 2 })
  subtotalPrice!: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 4 })
  taxRate!: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2 })
  taxAmount!: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status!: OrderStatus;

  constructor(
    orderNumber: string,
    orderTimestamp: Date,
    country: string,
    sku: string,
    quantity: number,
    unitPrice: number,
    originalPrice: number,
    discountRate: number,
    discountAmount: number,
    subtotalPrice: number,
    taxRate: number,
    taxAmount: number,
    totalPrice: number,
    status: OrderStatus
  ) {
    this.orderNumber = orderNumber;
    this.orderTimestamp = orderTimestamp;
    this.country = country;
    this.sku = sku;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.originalPrice = originalPrice;
    this.discountRate = discountRate;
    this.discountAmount = discountAmount;
    this.subtotalPrice = subtotalPrice;
    this.taxRate = taxRate;
    this.taxAmount = taxAmount;
    this.totalPrice = totalPrice;
    this.status = status;
  }
}
