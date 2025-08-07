import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/module-api/module/database.module';
import { AppModule } from '../../core/application-module/src/module/app.module';
import { UsersModule } from '../../adapters/http-adapter/src/module/users.module';

@Module({
  imports: [
    DatabaseModule.register(),
    AppModule.register(),
    UsersModule.register(),
  ],
})
export class ServiceEntrypointModule {}
