import { CreateUserDto } from '@app/user-api/adapters/http-adapter/src/dto/create-user.dto';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { RABBITMQ_URI } from 'libs/rabbitmq/src/config/rabbitmq.config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;

  async onModuleInit(): Promise<void> {
    try {
      this.connection = await connect(RABBITMQ_URI);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue('user_created', { durable: true });
    } catch (error) {
      console.error('Error initializing RabbitMQ:', error);
      throw error;
    }
  }

  // Метод для отправки сообщения в очередь
  sendUserCreatedMessage(pattern: string, user: CreateUserDto) {
    const message = {
      pattern,
      user,
      text: `Пользователь ${user.name} ${user.surname} создан`,
    };
    // Отправляем сообщение в очередь 'user_created'
    const isSent = this.channel.sendToQueue(
      'user_created',
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );

    if (!isSent) {
      console.warn('Сообщение не было отправлено в очередь, канал переполнен');
    }
  }

  // Закрываем соединение и канал при уничтожении модуля
  async onModuleDestroy(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
