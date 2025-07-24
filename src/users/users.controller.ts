import { Controller, Get, Post, Body, Put, Delete } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { DeleteUserDto } from 'src/dto/delete-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DatabaseService } from 'src/database/database.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly databaseService: DatabaseService) {}
  @Post()
  @ApiResponse({ status: 201 })
  createUser(@Body() dto: CreateUserDto) {
    return this.databaseService.createUser(dto);
  }
  @Get()
  findAll() {
    return this.databaseService.findAll();
  }
  @Delete()
  deleteUserById(@Body() dto: DeleteUserDto) {
    return this.databaseService.deleteUserById(dto);
  }
  @Put()
  updateUserById(@Body() dto: UpdateUserDto) {
    return this.databaseService.updateUserById(dto);
  }
}
