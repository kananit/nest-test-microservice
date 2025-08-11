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
  createUser(@Body() dto: CreateUserDto): Promise<CreateUserResult> {
    return this.userService.createUser(dto);
  }
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
  @Delete()
  deleteUserById(@Body() dto: DeleteUserDto): Promise<DeleteUserResult> {
    return this.userService.deleteUserById(dto);
  }
  @Put()
  updateUserById(@Body() dto: UpdateUserDto): Promise<UpdateUserResult> {
    return this.userService.updateUserById(dto);
  }
}
