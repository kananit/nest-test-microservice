import { DynamicModule, Module } from '@nestjs/common';
import { UsersService } from '../service/user-service';
import { UsersController } from 'apps/user-api/src/adapters/http-adapter/src/controllers/users.controller';
@Module({})
export class ApplicationModule {
  static register(): DynamicModule {
    return {
      module: ApplicationModule,
      providers: [UsersService],
      global: true,
      exports: [UsersService],
    };
  }
}
