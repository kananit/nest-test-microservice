import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [UsersController],
  providers: [DatabaseService],
})
export class AppModule {}
