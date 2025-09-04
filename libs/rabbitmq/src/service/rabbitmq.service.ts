import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CreateUserDto } from '@app/user-api/adapters/http-adapter/src/dto/create-user.dto';

@Injectable()
export class RabbitMQService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  sendUserCreatedMessage(user: CreateUserDto) {
    this.amqpConnection.publish('user_created', 'user_created', user);
    console.log(`Сообщение отправлено в очередь user_created: ${user.name}`);
  }
}
