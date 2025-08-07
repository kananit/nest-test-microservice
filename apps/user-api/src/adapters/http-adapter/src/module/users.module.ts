import { DynamicModule, Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { DatabaseService } from '@app/module-api/service/database.service';

@Module({})
export class UsersModule {
  static register(): DynamicModule {
    return {
      module: UsersModule,
      controllers: [UsersController],
      providers: [DatabaseService],
      global: true,
    };
  }
}
