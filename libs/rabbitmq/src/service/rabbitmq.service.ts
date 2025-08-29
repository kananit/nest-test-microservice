import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { CreateUserDto } from '@app/user-api/adapters/http-adapter/src/dto/create-user.dto';
import { RABBITMQ_URI } from 'libs/rabbitmq/src/config/rabbitmq.config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;

  // ------------------------
  // При инициализации модуля
  // ------------------------
  async onModuleInit(): Promise<void> {
    try {
      // Подключение к RabbitMQ
      this.connection = await connect(RABBITMQ_URI);

      // Создание канала
      this.channel = await this.connection.createChannel();

      // Создание очереди 'user_created' с durable=true
      await this.channel.assertQueue('user_created', { durable: true });

      // Логирование успешного подключения и готовности очереди
      console.log('RabbitMQ: соединение и очередь "user_created" готовы');
    } catch (error) {
      // Логируем ошибки подключения
      console.error('Ошибка подключения к RabbitMQ:', error);
      throw error;
    }
  }

  // ------------------------------------
  // Метод отправки сообщения в очередь
  // ------------------------------------
  sendUserCreatedMessage(user: CreateUserDto) {
    // Проверяем, что канал готов
    if (!this.channel) {
      console.error('Канал RabbitMQ не готов. Сообщение не отправлено.');
      return;
    }

    // Формируем сообщение
    const message = {
      user,
      text: `Пользователь ${user.name} ${user.surname} создан`,
    };

    // Отправка сообщения в очередь 'user_created' с persistent=true
    const isSent = this.channel.sendToQueue(
      'user_created',
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );

    // Логируем результат отправки
    if (!isSent) {
      console.warn('Сообщение не было отправлено в очередь, канал переполнен');
    } else {
      console.log('Сообщение отправлено в очередь "user_created":', message);
    }
  }

  // ------------------------------------
  // При завершении работы модуля
  // ------------------------------------
  async onModuleDestroy(): Promise<void> {
    try {
      // Закрываем канал и соединение только если они существуют
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();

      // Логирование закрытия соединения
      console.log('RabbitMQ: соединение закрыто');
    } catch (error) {
      // Логируем ошибки закрытия
      console.error('Ошибка при закрытии RabbitMQ:', error);
    }
  }
}
