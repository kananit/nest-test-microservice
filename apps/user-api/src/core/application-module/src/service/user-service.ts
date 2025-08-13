import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'apps/user-api/src/adapters/http-adapter/src/dto/create-user.dto';
import { UpdateUserDto } from 'apps/user-api/src/adapters/http-adapter/src/dto/update-user.dto';
import { DeleteUserDto } from 'apps/user-api/src/adapters/http-adapter/src/dto/delete-user.dto';
import {
  CreateUserResult,
  DeleteUserResult,
  UpdateUserResult,
  User,
} from '../../../../../../../libs/module-postgres/src/types/user.interfaces';
import { DatabaseService } from '@app/module-postgres/service/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(dto: CreateUserDto): Promise<CreateUserResult> {
    return await this.databaseService.createUser(dto);
  }

  async findAll(): Promise<User[]> {
    return await this.databaseService.findAll();
  }

  async deleteUserById(dto: DeleteUserDto): Promise<DeleteUserResult> {
    const user = await this.databaseService.findUserById(dto.id);
    if (!user) {
      throw new NotFoundException('Такого пользователя нет');
    }
    return await this.databaseService.deleteUserById(dto);
  }

  async updateUserById(dto: UpdateUserDto): Promise<UpdateUserResult> {
    return await this.databaseService.updateUserById(dto);
  }
}
