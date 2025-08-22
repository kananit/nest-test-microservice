import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class RabbitmqConsumer {
  private readonly logger = new Logger(RabbitmqConsumer.name);

  /**
   * Подписка на событие "user.created"
   * - exchange: "users"
   * - routingKey: "user.created"
   * - queue: "user.created.queue" (RabbitMQ создаст очередь с таким именем)
   */
  @RabbitSubscribe({
    exchange: 'users',
    routingKey: 'user.created',
    queue: 'user.created.queue',
  })
  handleUserCreated(msg: any) {
    this.logger.log(`📩 Получено событие user.created: ${JSON.stringify(msg)}`);
  }
}
