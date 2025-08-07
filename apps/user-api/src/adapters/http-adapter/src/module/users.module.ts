import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { DatabaseService } from '@app/module-api/service/database.service';

@Module({
  controllers: [UsersController],
  providers: [DatabaseService],
})
export class UsersModule {}
