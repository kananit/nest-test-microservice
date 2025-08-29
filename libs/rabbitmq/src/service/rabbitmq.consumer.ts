import { Injectable } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

@Injectable()
export class UserCreatedConsumer {
  // ------------------------------------------------
  // Подписка на сообщения с паттерном 'user_created'
  // ------------------------------------------------
  @EventPattern('user_created')
  async handleUserCreated(
    @Payload() data: any, // Данные сообщения
    @Ctx() context: RmqContext, // Контекст RabbitMQ, нужен для ack
  ) {
    // Логируем полученное сообщение
    console.log('Получено сообщение user_created:', data);

    // Получаем объект канала для подтверждения сообщения
    const channel = context.getChannelRef();

    // Получаем оригинальное сообщение
    const originalMsg = context.getMessage();

    // Подтверждаем, что сообщение обработано (ack)
    channel.ack(originalMsg);

    // Можно добавить дополнительную логику обработки сообщения здесь
    // Например, сохранять данные в базу, отправлять уведомления и т.д.
  }
}
