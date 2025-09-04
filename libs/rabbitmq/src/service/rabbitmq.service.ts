import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CreateUserDto } from '@app/user-api/adapters/http-adapter/src/dto/create-user.dto';

@Injectable()
export class RabbitMQService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendUserCreatedMessage(user: CreateUserDto): Promise<void> {
    try {
      await this.amqpConnection.publish('user_created', 'user_created', user);
      console.log(`Сообщение отправлено в очередь user_created: ${user.name}`);
    } catch (error) {
      console.error('Ошибка при отправке сообщения в RabbitMQ:', error);
    }
  }
}
