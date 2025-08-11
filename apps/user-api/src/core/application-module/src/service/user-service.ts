import { Controller, Get, Post, Body, Put, Delete } from '@nestjs/common';
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

export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}
  createUser(@Body() dto: CreateUserDto): Promise<CreateUserResult> {
    return this.databaseService.createUser(dto);
  }
  @Get()
  findAll(): Promise<User[]> {
    return this.databaseService.findAll();
  }
  @Delete()
  deleteUserById(@Body() dto: DeleteUserDto): Promise<DeleteUserResult> {
    return this.databaseService.deleteUserById(dto);
  }
  @Put()
  updateUserById(@Body() dto: UpdateUserDto): Promise<UpdateUserResult> {
    return this.databaseService.updateUserById(dto);
  }
}
