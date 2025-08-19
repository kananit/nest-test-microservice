import { DynamicModule, Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';

@Module({})
export class UsersModule {
  static register(): DynamicModule {
    return {
      module: UsersModule,
      controllers: [UsersController],
      global: true,
    };
  }
}
