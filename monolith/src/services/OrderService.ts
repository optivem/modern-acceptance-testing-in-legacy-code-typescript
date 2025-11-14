import { Order, OrderStatus } from '../entities/Order';
import { PlaceOrderRequest, PlaceOrderResponse, GetOrderResponse } from '../dtos/OrderDtos';
import { OrderRepository } from '../repositories/OrderRepository';
import { ErpGateway } from './external/ErpGateway';
import { TaxGateway } from './external/TaxGateway';
import { ValidationException, NotExistValidationException } from '../exceptions/ValidationExceptions';
import { v4 as uuidv4 } from 'uuid';

export class OrderService {
  private static readonly DECEMBER_31 = { month: 12, day: 31 };
  private static readonly CANCELLATION_BLOCK_START = { hour: 22, minute: 0 };
  private static readonly CANCELLATION_BLOCK_END = { hour: 23, minute: 0 };
  private static readonly ORDER_PLACEMENT_CUTOFF_TIME = { hour: 17, minute: 0 };

  private orderRepository: OrderRepository;
  private erpGateway: ErpGateway;
  private taxGateway: TaxGateway;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.erpGateway = new ErpGateway();
    this.taxGateway = new TaxGateway();
  }

  async placeOrder(request: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    const { sku, quantity, country } = request;

    const orderNumber = this.generateOrderNumber();
    const orderTimestamp = new Date();
    const unitPrice = await this.getUnitPrice(sku);
    const discountRate = this.getDiscountRate();
    const taxRate = await this.getTaxRate(country);

    const originalPrice = unitPrice * quantity;
    const discountAmount = originalPrice * discountRate;
    const subtotalPrice = originalPrice - discountAmount;
    const taxAmount = subtotalPrice * taxRate;
    const totalPrice = subtotalPrice + taxAmount;

    const order = new Order(
      orderNumber,
      orderTimestamp,
      country,
      sku,
      quantity,
      unitPrice,
      originalPrice,
      discountRate,
      discountAmount,
      subtotalPrice,
      taxRate,
      taxAmount,
      totalPrice,
      OrderStatus.PLACED
    );

    await this.orderRepository.save(order);

    const response = new PlaceOrderResponse();
    response.orderNumber = orderNumber;
    return response;
  }

  async getOrder(orderNumber: string): Promise<GetOrderResponse> {
    const order = await this.orderRepository.findById(orderNumber);

    if (!order) {
      throw new NotExistValidationException(`Order ${orderNumber} does not exist.`);
    }

    const response = new GetOrderResponse();
    response.orderNumber = orderNumber;
    response.sku = order.sku;
    response.quantity = order.quantity;
    response.unitPrice = order.unitPrice;
    response.originalPrice = order.originalPrice;
    response.discountRate = order.discountRate;
    response.discountAmount = order.discountAmount;
    response.subtotalPrice = order.subtotalPrice;
    response.taxRate = order.taxRate;
    response.taxAmount = order.taxAmount;
    response.totalPrice = order.totalPrice;
    response.status = order.status;
    response.country = order.country;

    return response;
  }

  async cancelOrder(orderNumber: string): Promise<void> {
    const order = await this.orderRepository.findById(orderNumber);

    if (!order) {
      throw new NotExistValidationException(`Order ${orderNumber} does not exist.`);
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (
      currentMonth === OrderService.DECEMBER_31.month &&
      currentDay === OrderService.DECEMBER_31.day &&
      (currentHour > OrderService.CANCELLATION_BLOCK_START.hour ||
        (currentHour === OrderService.CANCELLATION_BLOCK_START.hour &&
          currentMinute >= OrderService.CANCELLATION_BLOCK_START.minute)) &&
      (currentHour < OrderService.CANCELLATION_BLOCK_END.hour ||
        (currentHour === OrderService.CANCELLATION_BLOCK_END.hour &&
          currentMinute < OrderService.CANCELLATION_BLOCK_END.minute))
    ) {
      throw new ValidationException(
        'Order cancellation is not allowed on December 31st between 22:00 and 23:00'
      );
    }

    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);
  }

  private async getUnitPrice(sku: string): Promise<number> {
    const productDetails = await this.erpGateway.getProductDetails(sku);
    if (!productDetails) {
      throw new ValidationException(`Product does not exist for SKU: ${sku}`);
    }
    return productDetails.price;
  }

  private getDiscountRate(): number {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const cutoffTime = OrderService.ORDER_PLACEMENT_CUTOFF_TIME;
    if (
      currentHour < cutoffTime.hour ||
      (currentHour === cutoffTime.hour && currentMinute <= cutoffTime.minute)
    ) {
      return 0;
    }

    return 0.15;
  }

  private async getTaxRate(country: string): Promise<number> {
    const countryDetails = await this.taxGateway.getTaxDetails(country);
    if (!countryDetails) {
      throw new ValidationException(`Country does not exist: ${country}`);
    }
    return countryDetails.taxRate;
  }

  private generateOrderNumber(): string {
    return `ORD-${uuidv4()}`;
  }
}
