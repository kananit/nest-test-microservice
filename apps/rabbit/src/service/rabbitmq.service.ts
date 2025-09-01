import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { CreateUserDto } from '@app/user-api/adapters/http-adapter/src/dto/create-user.dto';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;
  private enableRabbit: boolean;

  constructor() {
    // Берём значение из переменных окружения
    this.enableRabbit = process.env.ENABLE_RABBITMQ === 'true';
  }

  async onModuleInit(): Promise<void> {
    if (!this.enableRabbit) {
      console.log('RabbitMQ локально отключён, подключение не выполняется');
      return;
    }

    const uri = process.env.RABBITMQ_URI;
    if (!uri) {
      console.warn('RABBITMQ_URI не задан, подключение пропущено');
      return;
    }

    try {
      console.log('Подключаемся к RabbitMQ по URI:', uri);
      this.connection = await connect(uri);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange('user_exchange', 'direct', {
        durable: true,
      });
      await this.channel.assertQueue('user_created', { durable: true });
      await this.channel.bindQueue(
        'user_created',
        'user_exchange',
        'user_created',
      );
    } catch (error) {
      console.error('Error initializing RabbitMQ:', error);
      throw error;
    }
  }

  sendUserCreatedMessage(pattern: string, user: CreateUserDto) {
    if (!this.enableRabbit || !this.channel) {
      console.warn(
        'RabbitMQ отключён или канал не создан, сообщение не отправлено',
      );
      return;
    }

    const message = {
      pattern,
      user,
      text: `Пользователь ${user.name} ${user.surname} создан`,
    };

    this.channel.publish(
      'user_exchange',
      'user_created',
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      },
    );
  }

  async onModuleDestroy(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}
