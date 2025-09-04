import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class UserCreatedConsumer {
  @RabbitSubscribe({
    exchange: 'user_created',
    routingKey: 'user_created',
    queue: 'user_created',
    queueOptions: {
      durable: true,
      autoDelete: false,
    },
    errorHandler: (channel, msg, error) => {
      console.error('Ошибка обработки сообщения:', error);
      channel.reject(msg, false); // сообщение отклоняется, но не переходит в очередь повторно
    },
  })
  handleUserCreated(data: any) {
    console.log('Получено сообщение user_created:', data);
    // Добавляем логику обработки, например, запись в БД
  }
}
