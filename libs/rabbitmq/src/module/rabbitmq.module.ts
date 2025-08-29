import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMQService } from '@app/rabbitmq/service/rabbitmq.service';

@Module({})
export class RabbitMQModule {
  static register(): DynamicModule {
    return {
      module: RabbitMQModule,
      providers: [RabbitMQService],
      exports: [RabbitMQService],
      global: true,
    };
  }
}
