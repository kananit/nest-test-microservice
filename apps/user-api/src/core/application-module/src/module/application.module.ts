import { DynamicModule, Module } from '@nestjs/common';
import { UsersModule } from '../../../../adapters/http-adapter/src/module/users.module';
import { UsersController } from '../../../../adapters/http-adapter/src/controllers/users.controller';
import { DatabaseModule } from '@app/module-postgres/module/database.module';
import { DatabaseService } from '@app/module-postgres/service/database.service';
import { UsersService } from '../service/user-service';

@Module({})
export class ApplicationModule {
  static register(): DynamicModule {
    return {
      module: ApplicationModule,
      providers: [UsersService],
      global: true,
    };
  }
}
