import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { RABBITMQ_URI } from 'libs/rabbitmq/src/config/rabbitmq.config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;

  async onModuleInit() {
    // Устанавливаем соединение с RabbitMQ
    this.connection = await connect(RABBITMQ_URI);
    // Создаём канал для общения с RabbitMQ
    this.channel = await this.connection.createChannel();
    // Объявляем очередь 'user_created', если она ещё не существует
    await this.channel.assertQueue('user_created', { durable: true });
  }

  // Метод для отправки сообщения в очередь
  async sendUserCreatedMessage(pattern: string, user: any) {
    const message = {
      pattern,
      user,
      text: `Пользователь ${user.name} ${user.surname} создан`,
    };
    // Отправляем сообщение в очередь 'user_created'
    this.channel.sendToQueue(
      'user_created',
      Buffer.from(JSON.stringify(message)), // преобразуем обьект в строку потом в бинарный код
      {
        persistent: true, // Сообщение будет сохраняться на диске
      },
    );
  }

  // Закрываем соединение и канал при уничтожении модуля
  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
