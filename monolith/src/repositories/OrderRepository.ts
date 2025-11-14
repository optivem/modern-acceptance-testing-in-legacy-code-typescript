import { getRepository } from 'typeorm';
import { Order } from '../entities/Order';

export class OrderRepository {
  private repository = getRepository(Order);

  async save(order: Order): Promise<Order> {
    return await this.repository.save(order);
  }

  async findById(orderNumber: string): Promise<Order | undefined> {
    return await this.repository.findOne({ where: { orderNumber } });
  }
}
