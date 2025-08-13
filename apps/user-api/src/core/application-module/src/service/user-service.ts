import { Injectable, NotFoundException } from '@nestjs/common';

import {
  CreateUserResult,
  DeleteUserResult,
  UpdateUserResult,
  User,
} from '@app/module-postgres/types/user.interfaces';
import { DatabaseService } from '@app/module-postgres/service/database.service';
import { UserDeleteInterface } from '@app/module-postgres/types/user-delete.interface';
import { UserCreate } from '@app/module-postgres/types/user-create.interface';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(userCreate: UserCreate): Promise<CreateUserResult> {
    return await this.databaseService.createUser(userCreate);
  }

  async findAll(): Promise<User[]> {
    return await this.databaseService.findAll();
  }

  async deleteUserById(
    userDelete: UserDeleteInterface,
  ): Promise<DeleteUserResult> {
    const userId = await this.databaseService.findUserById(userDelete.id);

    if (!userId) {
      throw new NotFoundException('Такого пользователя нет');
    }
    return await this.databaseService.deleteUserById(userDelete);
  }

  async updateUserById(user: User): Promise<UpdateUserResult> {
    return await this.databaseService.updateUserById(user);
  }
}
