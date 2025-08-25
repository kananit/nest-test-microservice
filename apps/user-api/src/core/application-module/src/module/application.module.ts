import { DynamicModule, Module } from '@nestjs/common';
import { UsersService } from '../service/user-service';
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
