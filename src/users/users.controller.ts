import { Controller, Get, Post, Body, Put, Delete } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { DeleteUserDto } from 'src/dto/delete-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserResult,
  DeleteUserResult,
  UpdateUserResult,
  User,
} from '../interfaces/user.interfaces';
import { DatabaseService } from 'src/database/database.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly databaseService: DatabaseService) {}
  @Post()
  @ApiResponse({ status: 201 })
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
