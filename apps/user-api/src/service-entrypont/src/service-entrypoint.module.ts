import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/module-postgres/module/database.module';
import { ApplicationModule } from '../../core/application-module/src/module/application.module';
import { UsersModule } from '../../adapters/http-adapter/src/module/users.module';
import { MinioModule } from '@app/module-minio/module/minio.module';
import { RabbitMQModule } from 'libs/rabbitmq/src/module/rabbitmq.module';

@Module({
  imports: [
    DatabaseModule.register(),
    ApplicationModule.register(),
    MinioModule.register(),
    UsersModule.register(),
    RabbitMQModule.register(),
  ],
})
export class ServiceEntrypointModule {}
