import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMQService } from '@app/user-api/core/application-module/src/service/rabbitmq.service';

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
