import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/module-api/module/database.module';
import { AppModule } from '../../core/application-module/src/module/app.module';

@Module({
  imports: [DatabaseModule.register(), AppModule.register()],
})
export class ServiceEntrypointModule {}
