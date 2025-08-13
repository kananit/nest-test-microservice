import { Injectable, NotFoundException } from '@nestjs/common';

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

  async createUser(user: User): Promise<CreateUserResult> {
    return await this.databaseService.createUser(user);
  }

  async findAll(): Promise<User[]> {
    return await this.databaseService.findAll();
  }

  async deleteUserById(user: User): Promise<DeleteUserResult> {
    const userId = await this.databaseService.findUserById(user.id);
    if (!userId) {
      throw new NotFoundException('Такого пользователя нет');
    }
    return await this.databaseService.deleteUserById(user);
  }

  async updateUserById(user: User): Promise<UpdateUserResult> {
    return await this.databaseService.updateUserById(user);
  }
}
