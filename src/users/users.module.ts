import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [UsersController],
  providers: [DatabaseService],
})
export class UsersModule {}
