import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqConsumer } from './rabbitmq.consumer';

@Global()
@Module({
  imports: [
    ConfigModule,
    RabbitMQModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'users',
            type: 'topic',
          },
        ],
        uri: configService.get<string>('RABBITMQ_URI'),
        connectionInitOptions: { wait: true },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RabbitmqService, RabbitmqConsumer],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
