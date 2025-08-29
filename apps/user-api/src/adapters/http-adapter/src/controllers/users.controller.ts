import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  BadRequestException,
  UseInterceptors,
  Param,
  UploadedFile,
} from '@nestjs/common';

import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserResult,
  DeleteUserResult,
  UpdateUserResult,
  User,
} from '@app/module-postgres/types/user.interfaces';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from 'apps/user-api/src/core/application-module/src/service/user-service';
import { MinioService } from '@app/module-minio/service/minio.service';
import { RabbitMQService } from 'libs/rabbitmq';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly minioService: MinioService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}
  @Post()
  @ApiResponse({ status: 201 })
  async createUser(@Body() dto: CreateUserDto): Promise<CreateUserResult> {
<<<<<<< HEAD
    // Отправляем DTO в RabbitMQ
    this.rabbitMQService.sendUserCreatedMessage(dto);
    // Сохраняем пользователя и возвращаем результат
=======
    this.rabbitMQService.sendUserCreatedMessage('user_created', dto); // сообщение пользоваетль создан (RabbitMQ)
>>>>>>> main
    return await this.userService.createUser(dto);
  }

  @Post('avatar/:userId') // minio
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadUserAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Файл не передан');
      }

      const ext = file.originalname.split('.').pop();
      const key = `avatars/${userId}.${ext}`;

      await this.minioService.uploadFile(key, file.buffer, file.mimetype);

      return {
        message: 'Аватар загружен успешно',
        fileName: key,
        downloadUrl: `/files/download/${key}`,
      };
    } catch (err) {
      console.error('Ошибка загрузки аватара:', err);
      throw err;
    }
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }
  @Delete()
  async deleteUserById(@Body() dto: DeleteUserDto): Promise<DeleteUserResult> {
    if (!dto || dto.id === undefined) {
      throw new BadRequestException('Не передан id пользователя');
    }
    return await this.userService.deleteUserById(dto.id);
  }
  @Put()
  async updateUserById(@Body() dto: UpdateUserDto): Promise<UpdateUserResult> {
    return await this.userService.updateUserById(dto);
  }
}
