import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class RabbitmqService {
  constructor(private readonly amqp: AmqpConnection) {}

  /**
   * Отправка сообщения о создании пользователя.
   * - exchange: "users"
   * - routingKey: "user.created"
   */
  async publishUserCreated(user: {
    id: string;
    email: string;
    createdAt: Date;
  }) {
    await this.amqp.publish('users', 'user.created', user);
  }

  /**
   * Универсальный метод для публикации любого сообщения в RabbitMQ.
   * @param exchange - имя exchange (например, "users")
   * @param routingKey - ключ маршрутизации (например, "user.deleted")
   * @param payload - объект, который отправляем
   */
  async publish(exchange: string, routingKey: string, payload: any) {
    await this.amqp.publish(exchange, routingKey, payload);
  }
}
