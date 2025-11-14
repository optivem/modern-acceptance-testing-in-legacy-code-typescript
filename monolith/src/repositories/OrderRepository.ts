import { getRepository, Repository } from 'typeorm';
import { Order } from '../entities/Order';

export class OrderRepository {
  private getRepository(): Repository<Order> {
    return getRepository(Order);
  }

  async save(order: Order): Promise<Order> {
    return await this.getRepository().save(order);
  }

  async findById(orderNumber: string): Promise<Order | null> {
    return await this.getRepository().findOne({ where: { orderNumber } });
  }
}
