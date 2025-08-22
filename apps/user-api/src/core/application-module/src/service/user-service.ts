import { Injectable, NotFoundException } from '@nestjs/common';

import {
  CreateUserPayload,
  CreateUserResult,
  DeleteUserResult,
  UpdateUserResult,
  User,
} from '@app/module-postgres/types/user.interfaces';
import { DatabaseService } from '@app/module-postgres/service/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(payload: CreateUserPayload): Promise<CreateUserResult> {
    return await this.databaseService.createUser(payload);
  }

  async findAll(): Promise<User[]> {
    return await this.databaseService.findAll();
  }

  async deleteUserById(id: string): Promise<DeleteUserResult> {
    const userId = await this.databaseService.findUserById(id);

    if (!userId) {
      throw new NotFoundException('Такого пользователя нет');
    }
    return await this.databaseService.deleteUserById(id);
  }

  async updateUserById(user: User): Promise<UpdateUserResult> {
    const userId = await this.databaseService.findUserById(user.id);
    if (!userId) {
      throw new NotFoundException('Такого пользователя нет');
    }
    return await this.databaseService.updateUserById(user);
  }
}
