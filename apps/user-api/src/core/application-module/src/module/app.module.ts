import { Module } from '@nestjs/common';
import { UsersModule } from '../../../../adapters/http-adapter/src/module/users.module';
import { UsersController } from '../../../../adapters/http-adapter/src/controllers/users.controller';
import { DatabaseModule } from '@app/module-api/module/database.module';
import { DatabaseService } from '@app/module-api/service/database.service';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [UsersController],
  providers: [DatabaseService],
})
export class AppModule {}
