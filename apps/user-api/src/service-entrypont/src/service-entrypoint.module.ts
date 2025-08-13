import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/module-postgres/module/database.module';
import { ApplicationModule } from '../../core/application-module/src/module/application.module';
import { UsersModule } from '../../adapters/http-adapter/src/module/users.module';

@Module({
  imports: [
    DatabaseModule.register(),
    ApplicationModule.register(),
    UsersModule.register(),
  ],
})
export class ServiceEntrypointModule {}
