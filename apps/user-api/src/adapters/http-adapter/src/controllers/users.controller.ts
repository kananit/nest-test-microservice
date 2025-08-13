import { Controller, Get, Post, Body, Put, Delete } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserResult,
  DeleteUserResult,
  UpdateUserResult,
  User,
} from '../../../../../../../libs/module-postgres/src/types/user.interfaces';
import { UsersService } from 'apps/user-api/src/core/application-module/src/service/user-service';
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  @ApiResponse({ status: 201 })
  async createUser(@Body() dto: CreateUserDto): Promise<CreateUserResult> {
    return await this.userService.createUser(dto);
  }
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }
  @Delete()
  async deleteUserById(@Body() dto: DeleteUserDto): Promise<DeleteUserResult> {
    return await this.userService.deleteUserById(dto);
  }
  @Put()
  async updateUserById(@Body() dto: UpdateUserDto): Promise<UpdateUserResult> {
    return await this.userService.updateUserById(dto);
  }
}
