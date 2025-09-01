import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMQService } from '../service/rabbitmq.service';
import { UserCreatedConsumer } from '../service/rabbitmq.consumer';

@Module({})
export class RabbitMQModule {
  static register(): DynamicModule {
    return {
      module: RabbitMQModule,
      providers: [RabbitMQService, UserCreatedConsumer],
      exports: [RabbitMQService],
      global: true,
    };
  }
}
