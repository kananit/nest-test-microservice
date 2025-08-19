import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseService } from '../service/database.service';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    // делаем динамический модуль
    return {
      module: DatabaseModule,
      providers: [DatabaseService],
      exports: [DatabaseService],
      global: true,
    };
  }
}
