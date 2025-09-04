import { DynamicModule, Module } from '@nestjs/common';
import { UsersService } from '../service/user-service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { UserCreatedConsumer } from '@app/rabbitmq/service/user-created.consumer';
import { RabbitMQService } from 'libs/rabbitmq';

@Module({})
export class ApplicationModule {
  static register(): DynamicModule {
    const rabbitMqUri = process.env.RABBITMQ_URI;
    if (!rabbitMqUri) {
      throw new Error('RABBITMQ_URI is not defined');
    }

    return {
      module: ApplicationModule,
      imports: [
        RabbitMQModule.forRootAsync({
          useFactory: () => ({
            exchanges: [{ name: 'user_created', type: 'direct' }],
            uri: rabbitMqUri,
            connectionInitOptions: { wait: false },
          }),
        }),
      ],
      providers: [UsersService, RabbitMQService, UserCreatedConsumer],
      exports: [UsersService, RabbitMQService],
      global: true,
    };
  }
}
