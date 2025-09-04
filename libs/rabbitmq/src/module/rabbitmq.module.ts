import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMQModule as GolevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { UserCreatedConsumer } from '../service/user-created.consumer';
import { RabbitMQService } from '../service/rabbitmq.service';

@Module({})
export class RabbitMQModule {
  static register(queueName: string): DynamicModule {
    const rabbitMqUri = process.env.RABBITMQ_URI;
    if (!rabbitMqUri) {
      throw new Error('RABBITMQ_URI is not defined');
    }

    return {
      module: RabbitMQModule,
      imports: [
        GolevelupRabbitMQModule.forRootAsync({
          useFactory: () => ({
            exchanges: [
              {
                name: queueName,
                type: 'direct',
              },
            ],
            uri: rabbitMqUri,
            connectionInitOptions: { wait: false },
          }),
        }),
      ],
      providers: [UserCreatedConsumer, RabbitMQService],
      exports: [GolevelupRabbitMQModule, RabbitMQService, UserCreatedConsumer],
    };
  }
}
